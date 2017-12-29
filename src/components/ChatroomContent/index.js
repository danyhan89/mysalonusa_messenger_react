import React, { Component } from "react";
import PropTypes from "prop-types";

import io from "socket.io-client";
import uuidv4 from "uuid/v4";

import communities from "src/communities";
import Label from "@app/Label";
import join from "@app/join";
import Input from "@app/Input";
import Button from "@app/Button";
import ActionButton from "@app/ActionButton";
import Overlay from "@app/Overlay";

import { fetchChats } from "src/api";

import { isValid as isValidState } from "src/states";

import JOB_ICON from "./jobIcon";
import APPLY_ICON from "./applyIcon";

import ApplyOverlay from "./ApplyOverlay";

import styles from "./index.scss";

const STORED_NICKNAME = global.localStorage.getItem("nickname");
let STORED_ALIAS = global.localStorage.getItem('alias')

const NICKNAME = STORED_NICKNAME || uuidv4();
if (!STORED_NICKNAME) {
  global.localStorage.setItem("nickname", NICKNAME);
}

const emptyFn = () => { };

const SPACER = <div className={styles.flex1} />;

const connect = state => {
  if (!state || !isValidState(state)) {
    throw "No valid state";
  }
  const socketURL = process.env.SERVER_URL + "/" + state.toLowerCase();

  return io(socketURL);
};

const isValidAlias = (alias) => alias.length >= 1

class ChatroomContent extends Component {
  constructor(props) {
    super(props);

    this.onTextChange = this.onTextChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
    this.renderMessage = this.renderMessage.bind(this);

    const { state: chosenState } = props;

    this.openSocket(chosenState);

    this.state = {
      alias: '',
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
    if (event) {
      event.preventDefault();
    }

    if (!this.state.text) {
      return;
    }


    if (!STORED_ALIAS) {
      this.setState({
        needsAlias: true
      })
      return
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

  onTextChange(text) {
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
        community,
        nickname: NICKNAME,
        alias: STORED_ALIAS,
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

  renderApplyOverlay() {
    if (!this.state.applyForJob) {
      return null;
    }

    return (
      <ApplyOverlay
        job={this.state.applyForJob}
        onDismiss={() => {
          this.setState({
            applyForJob: null
          });
        }}
      />
    );
  }

  setAlias(alias) {
    STORED_ALIAS = alias
    global.localStorage.setItem('alias', alias)
    this.onSubmit()
  }

  renderAliasOverlay() {
    if (!this.state.needsAlias) {
      return null
    }

    const onSubmit = (event) => {
      event.preventDefault()
      const { alias } = this.state

      if (!isValidAlias(alias)) {
        return
      }

      this.setAlias(alias)
      this.setState({
        needsAlias: false
      })
    }

    const onClose = () => {
      this.setState({
        needsAlias: false
      })
    }

    return <Overlay onClose={onClose} tag="form" onSubmit={onSubmit} closeable className="flex flex-column">
      <div className="mb3">
        <Label>pleaseProvideNickname</Label>:
      </div>

      <Input value={this.state.alias} onChange={alias => {
        this.setState({ alias })
      }} style={{ minWidth: 200 }} placeholder="Your alias" className="mb3" />
      <ActionButton style={{ minWidth: 200 }} disabled={!isValidAlias(this.state.alias)}>
        Okay
      </ActionButton>
    </Overlay>
  }

  render() {
    return (
      <div className={`col-12 ${styles.content}`}>
        <div className={styles.messages} ref={this.messagesRef}>
          {SPACER}
          {this.state.messages.map(this.renderMessage)}
        </div>
        {this.renderAliasOverlay()}
        {this.renderApplyOverlay()}
        <form onSubmit={this.onSubmit} className={styles.form}>
          <Input
            onChange={this.onTextChange}
            value={this.state.text}
            className={`${styles.input} mt2 mr2`}
          />
          <Button disabled={!this.state.text} className={`br3 pa3 mt2`}>
            <Label>Send</Label>
          </Button>
        </form>
      </div>
    );
  }

  onApply(job, message) {
    this.setState({ applyForJob: job });
  }

  renderJobMessage(job, msg) {
    const itsMe = this.itsMe(msg);
    return (
      <div
        key={job.id || index}
        className={join(` mt2`, itsMe && styles.flexEnd)}
      >
        {job.alias || <Label>unknown</Label>}:
        <div className={join('br3 pa2', styles.jobMessage,
          styles.message,
          itsMe && styles.myMessage
        )}>
          <div className="f3 flex items-center">
            {JOB_ICON({ size: 32 })} <Label>jobPost</Label>
          </div>
          <div>
            <Label>jobEmail</Label>: {job.email}
          </div>
          <div>
            <Label>jobNickname</Label>: {job.nickname}
          </div>
          <div className="mt3">
            <Label>jobDescription</Label>:
        </div>
          <div>{job.description}</div>

          {!itsMe ? (
            <div
              onClick={this.onApply.bind(this, job, msg)}
              className={`br3 ma3 pa3 f3 flex items-center ${styles.apply}`}
            >
              {APPLY_ICON({ size: 32 })} <Label>APPLY</Label>
            </div>
          ) : null}
        </div>
      </div>
    );
  }

  renderMessage(msg, index) {
    const isJob = msg.chat_type == 1;

    if (isJob) {
      return this.renderJobMessage(JSON.parse(msg.message), msg);
    }


    const { message, nickname, alias } = msg
    const me = this.itsMe(msg)
    return (
      <div
        key={msg.id || index}
        className={`mt2 ${join(
          me && styles.flexEnd
        )}`}
      >
        {alias || <Label>unknown</Label>}:
        <div className={join('pa2 br3', styles.message, me && styles.myMessage)}>
          {message}
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
