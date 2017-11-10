import React, { Component } from "react";
import PropTypes from "prop-types";

import io from "socket.io-client";
import styles from "./index.scss";

import communities from "src/communities";
import Label from "@app/Label";

const emptyFn = () => {};

const connect = state => {
  const socketURL = process.env.SERVER_URL + "/" + state;

  return io(socketURL);
};

class ChatroomContent extends Component {
  constructor(props) {
    super(props);

    this.onTextChange = this.onTextChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);

    const { state: chosenState } = props;

    this.socket = connect(chosenState);

    this.socket.on("publish", message => {
      message = JSON.parse(message);

      const community = message.community || {};
      if (community.name == props.community || props.community === "combined") {
        this.pushMessage(message);
      }
    });

    this.state = {
      text: "",
      messages: []
    };
  }

  componentWillUnmount() {
    this.socket.close();
    this.socket = null;
  }

  onSubmit(event) {
    event.preventDefault();

    this.send(this.state.text);
    this.clearText();
  }

  pushMessage(message) {
    this.setState({
      messages: [...this.state.messages, message]
    });
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
        community: { name: community },
        nickname: "placeholder",
        message: text
      })
    );
  }
  clearText() {
    this.setState({ text: "" });
  }

  render() {
    return (
      <div className={`col-8 col-md-10 ${styles.content}`}>
        chatroom content
        <form onSubmit={this.onSubmit}>
          <input
            type="text"
            onChange={this.onTextChange}
            value={this.state.text}
          />
          <button type="submit">send</button>
        </form>
        <div>
          {this.state.messages.map(msg => (
            <div key={msg.id}>{msg.message}</div>
          ))}
        </div>
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
