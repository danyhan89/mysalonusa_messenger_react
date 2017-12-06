import React, { Component } from "react";
import PropTypes from "prop-types";

import io from "socket.io-client";
import uuidv4 from "uuid/v4";

import communities from "src/communities";
import Label from "@app/Label";
import join from "@app/join";

import { fetchChats } from "src/api";

import { isValid as isValidState } from "src/states";

import styles from "./index.scss";

const STORED_NICKNAME = global.localStorage.getItem("nickname");
const NICKNAME = STORED_NICKNAME || uuidv4();
if (!STORED_NICKNAME) {
  global.localStorage.setItem("nickname", NICKNAME);
}

const emptyFn = () => {};

const SPACER = <div className={styles.flex1} />;

const connect = state => {
  if (!state || !isValidState(state)) {
    throw "No valid state";
  }
  const socketURL = process.env.SERVER_URL + "/" + state.toLowerCase();

  return io(socketURL);
};

class ChatroomContent extends Component {
  constructor(props) {
    super(props);

    this.onTextChange = this.onTextChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);

    const { state: chosenState } = props;

    this.openSocket(chosenState);

    this.state = {
      text: "",
      skip: 0,
      messages: []
    };

    this.messagesRef = node => {
      this.messagesNode = node;
    };
  }

  openSocket(chosenState, props = this.props) {
    this.socket = connect(chosenState);

    this.socket.on("publish", message => {
      message = JSON.parse(message);

      const community = message.community || {};
      if (community.name == props.community || props.community === "combined") {
        this.pushMessage(message);
      }
    });
  }

  closeSocket() {
    if (this.socket) {
      this.socket.close();
      this.socket = null;
    }
  }

  componentDidMount() {
    const { props } = this;
    fetchChats({
      skip: this.state.skip,
      state: props.state,
      community: props.community
    }).then(chats => {
      this.setState(
        {
          messages: chats.reverse()
        },
        this.scrollToBottom
      );
    });
  }

  componentWillUnmount() {
    this.closeSocket();
  }

  onSubmit(event) {
    event.preventDefault();

    if (!this.state.text) {
      return;
    }
    this.send(this.state.text);
    this.clearText();
  }

  pushMessage(message) {
    this.setState(
      {
        messages: [...this.state.messages, message]
      },
      this.scrollToBottom
    );
  }

  scrollToBottom() {
    this.messagesNode.scrollTop += this.messagesNode.scrollHeight;
  }

  onTextChange(event) {
    const text = event.target.value;

    this.setState({
      text
    });
  }

  send(text) {
    const { state, community } = this.props;

    this.socket.emit(
      "message",
      JSON.stringify({
        state,
        community: {
          name: community
        },
        nickname: NICKNAME,
        message: text
      })
    );
  }
  clearText() {
    this.setState({
      text: ""
    });
  }

  itsMe(message) {
    return message.nickname === NICKNAME;
  }

  render() {
    return (
      <div className={`col-12 ${styles.content}`}>
        <div className={styles.messages} ref={this.messagesRef}>
          {SPACER}
          {this.state.messages.map((msg, index) => (
            <div
              key={msg.id || index}
              className={join(
                styles.message,
                this.itsMe(msg) && styles.myMessage
              )}
            >
              {msg.message}
            </div>
          ))}
        </div>
        <form onSubmit={this.onSubmit} className={styles.form}>
          <input
            type="text"
            onChange={this.onTextChange}
            value={this.state.text}
            className={styles.input}
            autoFocus
          />
          <button
            type="submit"
            className={join(
              styles.submitButton,
              !this.state.text && styles.disabled
            )}
          >
            Send
          </button>{" "}
        </form>
      </div>
    );
  }
}

ChatroomContent.propTypes = {
  state: PropTypes.string.isRequired,
  community: PropTypes.string.isRequired,
  lang: PropTypes.string.isRequired
};

export default ChatroomContent;
