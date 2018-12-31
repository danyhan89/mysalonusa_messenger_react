import React, { Component } from "react";
import PropTypes from "prop-types";
import { findDOMNode } from "react-dom";

import io from "socket.io-client";

import LoadingIcon from "@app/LoadingIcon";
import Label from "@app/Label";
import join from "@app/join";
import Input from "@app/Input";
import Button from "@app/Button";
import ActionButton from "@app/ActionButton";
import Overlay from "@app/Overlay";
import Popup from "@app/Popup";

import { incrementJobView, fetchChats } from "src/api";

import { isValid as isValidState } from "src/states";

import ChatInput from "./ChatInput";
import JobMessage from "./JobMessage";
import ChatMessage from "./ChatMessage";
import PostJobForm from "../PostAJob/PostJobForm";

import styles from "./index.scss";
import ViewAndApply from "../ViewAndApply";

import getNickname from "./getNickname";

let STORED_ALIAS = global.localStorage.getItem("alias");

const SPACER = <div className={styles.flex1} />;

const incrementViews = job =>
  incrementJobView(job).then(response => {
    const { views } = response;

    return views;
  });

const connect = state => {
  if (!state || !isValidState(state)) {
    throw "No valid state";
  }
  const socketURL = process.env.SERVER_URL + "/" + state.toLowerCase();

  return io(socketURL);
};

const LIMIT = 50;

const isValidAlias = alias => alias.length >= 1;

class ChatroomContent extends Component {
  constructor(props) {
    super(props);

    this.onReplyTextChange = this.onReplyTextChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
    this.onReplySubmit = this.onReplySubmit.bind(this);
    this.renderMessage = this.renderMessage.bind(this);
    this.onMessagesScroll = this.onMessagesScroll.bind(this);

    const { state: chosenState } = props;

    this.beforeId = null;

    this.inputRef = cmp => {
      this.inputNode = cmp ? findDOMNode(cmp) : null;
    };
    this.replyInputRef = cmp => {
      this.replyInputNode = cmp ? findDOMNode(cmp) : null;
    };

    this.openSocket(chosenState);

    this.state = {
      loading: true,
      alias: "",
      text: "",
      skip: 0,
      replyTexts: {},
      messages: []
    };

    this.messagesRef = node => {
      if (node) {
        node.addEventListener("scroll", this.onMessagesScroll, {
          passive: true
        });
      } else {
        if (this.messagesNode) {
          this.messagesNode.removeEventListener(
            "scroll",
            this.onMessagesScroll,
            { passive: true }
          );
        }
      }

      this.messagesNode = node;
    };
  }

  onMessagesScroll(event) {
    const target = event.target;

    if (target.scrollTop == 0) {
      const scrollTop = target.scrollHeight;

      this.fetchMore(() => {
        target.scrollTop = target.scrollHeight - scrollTop;
      });
    }
  }

  fetchMore(callback) {
    return;
    const { props } = this;

    const beforeId = this.state.messages.length
      ? this.state.messages[0].id
      : null;

    if (beforeId && this.beforeId && this.beforeId <= beforeId) {
      return;
    }

    this.beforeId = beforeId;

    this.setState({ loading: true });
    fetchChats({
      limit: this.props.limit || LIMIT,
      beforeId,
      state: props.state,
      community: props.community
    }).then(result => {
      const { chats, replies } = this.parseResult(result);

      //const viewViews = messages.filter
      this.setState(
        {
          loading: false,
          messages: chats,
          replies
        },
        callback
      );
    });
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

    this.socket.on("edit", message => {
      message = JSON.parse(message);
      const community = message.community || {};
      if (community.name == props.community || props.community === "combined") {
        this.pushEditedMessage(message);
      }
    });

    this.socket.on("delete", id => {
      this.pushDeletedMessage(id);
    });
  }

  closeSocket() {
    if (this.socket) {
      this.socket.close();
      this.socket = null;
    }
  }

  parseResult(result) {
    //debugger;
    let { chats, replies } = result;
    // chats = (chats || []).reverse();
    replies = replies || {};
    replies = Object.keys(replies).reduce((acc, chatId) => {
      const value = replies[chatId];
      acc[chatId] = value ? value.reverse() : value;
      return acc;
    }, {});

    return { replies, chats };
  }

  componentDidMount() {
    const { props } = this;

    fetchChats({
      limit: this.props.limit || LIMIT,
      state: props.state,
      community: props.community
    }).then(result => {
      const { chats, replies } = this.parseResult(result);
      this.setState(
        {
          loading: false,
          messages: chats,
          replies
        },
        this.scrollToTop
      );
    });
  }

  componentWillUnmount() {
    this.closeSocket();
  }

  onSubmit(event, text, clearText) {
    if (event) {
      event.preventDefault();
    }

    if (!text) {
      return;
    }

    if (!STORED_ALIAS) {
      this.setState({
        needsAlias: true
      });
      return;
    }
    this.send(text);
    clearText();
  }

  onReplySubmit({ msg, text }) {
    if (!text) {
      return;
    }

    if (!STORED_ALIAS) {
      this.setState({
        needsAlias: true
      });
      return;
    }
    const parent = msg;

    this.send(text, {
      parent_id: parent.id,
      ancestor_id: parent.ancestorId
    });
  }

  pushMessage(message) {
    // const atBottom = this.isScrolledBottom();
    if (message.parent_id) {
      const replies = { ...this.state.replies };
      const parentReplies = [...(replies[message.parent_id] || []), message];
      replies[message.parent_id] = parentReplies;
      this.setState({
        replies
      });
      return;
    }
    this.setState(
      {
        messages: [message, ...this.state.messages]
      },
      () => {
        if (this.itsMe(message)) {
          this.scrollToTop();
        }
      }
    );
  }

  pushEditedMessage(message) {
    this.setState({
      messages: this.state.messages.map(msg => {
        if (msg.id === message.id) {
          return message;
        }
        return msg;
      })
    });
  }

  pushDeletedMessage(id) {
    this.setState({
      messages: this.state.messages.filter(msg => {
        if (msg.id === id) {
          return false;
        }
        return true;
      })
    });
  }
  scrollToTop() {
    this.messagesNode.scrollTop = 0;
  }
  scrollToBottom() {
    this.messagesNode.scrollTop += this.messagesNode.scrollHeight;
  }
  isScrolledBottom() {
    return (
      this.messagesNode.scrollTop ===
      this.messagesNode.scrollHeight - this.messagesNode.offsetHeight
    );
  }
  onReplyTextChange(msg, replyText) {
    this.setState({
      replyTexts: {
        ...this.state.replyTexts,
        [msg.id]: replyText
      }
    });
  }

  send(text, { parent_id } = {}) {
    const { state, community } = this.props;
    const { editMessage } = this.state;

    if (editMessage) {
      const newMessage = {
        ...editMessage,
        message: text,
        parent_id
      };
      this.setState({
        editMessage: null
      });
      this.socket.emit("editMessage", JSON.stringify(newMessage));
      return;
    }

    this.socket.emit(
      "message",
      JSON.stringify({
        state,
        community,
        nickname: getNickname(),
        alias: STORED_ALIAS,
        message: text,
        parent_id
      })
    );
  }

  clearReplyText(msg) {
    const newState = {};
    if (this.state.replyTo && this.state.replyTo.id === msg.id) {
      newState.replyTo = null;
    }
    newState.replyTexts = {
      ...this.state.replyTexts,
      [msg.id]: ""
    };
    this.setState(newState);
  }

  deleteMessage(msg) {
    this.setState({
      deleteMessage: msg
    });
  }

  doDelete(id) {
    this.socket.emit("deleteMessage", id);
  }

  editMessage(msg) {
    if (this.isJob(msg)) {
      const job = JSON.parse(msg.message);
      this.onEditJob(job, msg);
      return;
    }

    this.setState(
      {
        editMessage: msg,
        text: msg.message
      },
      () => {
        this.inputNode.focus();
      }
    );
  }

  itsMe(message) {
    return message.nickname === getNickname();
  }

  updateJobViews(job, message) {
    incrementViews(job).then(views => {
      this.setState({
        messages: this.state.messages.map(m => {
          if (m.id == message.id) {
            job.views = views;
            m.message = JSON.stringify(job);
          }
          return m;
        })
      });
    });
  }

  renderApplyOverlay() {
    const job = this.state.applyForJob;

    if (!job) {
      return null;
    }

    return (
      <ViewAndApply
        defaultStep="apply"
        onDismiss={() => {
          this.setState({ applyForJob: null });
        }}
        job={job}
        lang={this.props.lang}
        state={this.props.state}
        community={this.props.community}
      />
    );
  }

  setAlias(alias) {
    STORED_ALIAS = alias;
    global.localStorage.setItem("alias", alias);
    this.onSubmit();
  }

  renderAliasOverlay() {
    if (!this.state.needsAlias) {
      return null;
    }

    const onSubmit = event => {
      event.preventDefault();
      const { alias } = this.state;

      if (!isValidAlias(alias)) {
        return;
      }

      this.setAlias(alias);
      this.setState({
        needsAlias: false
      });
    };

    const onClose = () => {
      this.setState({
        needsAlias: false
      });
    };

    return (
      <Overlay
        onClose={onClose}
        tag="form"
        onSubmit={onSubmit}
        closeable
        className="flex flex-column"
      >
        <div className="mb3">
          <Label>pleaseProvideNickname</Label>:
        </div>

        <Input
          value={this.state.alias}
          onChange={alias => {
            this.setState({ alias });
          }}
          style={{ minWidth: 200 }}
          placeholder="Your alias"
          className="mb3"
        />
        <ActionButton
          style={{ minWidth: 200 }}
          disabled={!isValidAlias(this.state.alias)}
        >
          Okay
        </ActionButton>
      </Overlay>
    );
  }

  renderDeletePopup() {
    if (!this.state.deleteMessage) {
      return null;
    }
    const onClose = () => {
      this.setState({
        deleteMessage: null
      });
    };

    return (
      <Popup>
        <div className="mb3">
          <Label>confirmDeleteMessage</Label>
        </div>

        <div className="flex flex-row justify-center">
          <ActionButton onClick={onClose} className="ma2 mr0">
            <Label>no</Label>
          </ActionButton>
          <ActionButton
            className="ma2"
            onClick={() => {
              this.doDelete(this.state.deleteMessage.id);
              onClose();
            }}
          >
            <Label>yes</Label>
          </ActionButton>
        </div>
      </Popup>
    );
  }

  renderLoader() {
    if (!this.props.showLoading) {
      return null;
    }
    const visibleCls = this.state.loading ? styles.loaderVisible : "";

    return (
      <div className={`absolute ${styles.loader} br3 pa2 ${visibleCls}`}>
        {" "}
        <LoadingIcon /> <Label>loading</Label>....
      </div>
    );
  }

  render() {
    const empty = !this.state.messages.length && !this.state.loading;
    const style = {};
    if (empty) {
      style.display = "block";
    }
    return (
      <div className={` ${styles.content} relative`}>
        {this.renderLoader()}
        {this.props.showForm ? (
          <ChatInput
            onSubmit={this.onSubmit}
            stylesForm={styles.form}
            stylesInput={styles.input}
            inputRef={this.inputRef}
          />
        ) : null}
        <div
          className={`${styles.messages} ph2 pt2`}
          style={style}
          ref={this.messagesRef}
        >
          {empty ? (
            <div className="tc gray f4 pa3">
              <Label>noMessages</Label>
            </div>
          ) : null}
          {SPACER}
          {!empty
            ? this.state.messages.map((message, index, array) => {
                return this.renderMessage(
                  {
                    nestingLevel: 0,
                    last: index === array.length - 1,
                    parent: null
                  },
                  message,
                  index,
                  array
                );
              })
            : null}
        </div>
        {this.renderAliasOverlay()}
        {this.renderDeletePopup()}
        {this.renderApplyOverlay()}
        {this.renderJobEditOverlay()}
        {this.renderJobViewOverlay()}
      </div>
    );
  }

  onApply(job, msg) {
    this.setState({ applyForJob: job, applyForJobMessage: msg });
    this.updateJobViews(job, msg);
  }

  onEditJob(job, message) {
    this.setState({
      jobToEdit: job
    });
  }

  renderJobEditOverlay() {
    const job = this.state.jobToEdit;

    if (!job) {
      return null;
    }

    return (
      <Overlay
        closeable
        onClose={() => {
          this.setState({ jobToEdit: null });
        }}
      >
        <PostJobForm
          defaultValues={job}
          onSuccess={() => {
            this.setState({
              jobToEdit: null
            });
          }}
          lang={this.props.lang}
          state={this.props.state}
          community={this.props.community}
        />
      </Overlay>
    );
  }

  renderJobViewOverlay() {
    const job = this.state.jobToView;

    if (!job) {
      return null;
    }

    return (
      <ViewAndApply
        onDismiss={() => {
          this.setState({ jobToView: null });
        }}
        job={job}
        lang={this.props.lang}
        state={this.props.state}
        community={this.props.community}
      />
    );
  }

  onViewJob(job, msg) {
    this.updateJobViews(job, msg);
    this.setState({
      jobToView: job,
      jobToViewMessage: msg
    });
  }

  isJob(message) {
    return message.chat_type == 1;
  }
  /*
  canDeleteMessage(message) {
    const isJob = this.isJob(message);
    const now = DateTime.utc();
    const twoDaysBefore = now.plus({ seconds: 20 });

    const createdAt = DateTime.fromISO(message.created_at);

    //todo
    return true;
    if (createdAt < twoDaysBefore) {
      return false;
    }
    return true;
  }

  canEditMessage(message) {
    return this.canDeleteMessage(message);
  }

*/
  renderMessage({ nestingLevel, last, parent }, msg, index) {
    const itsMe = this.itsMe(msg);

    const jobMessage = this.isJob(msg) ? JSON.parse(msg.message) : null;

    return jobMessage ? (
      <JobMessage
        key={jobMessage.id || index}
        job={jobMessage}
        className={itsMe ? "fr mt1" : "mt1"}
        onViewClick={this.onViewJob.bind(this, jobMessage, msg)}
        onApplyClick={this.onApply.bind(this, jobMessage, msg)}
      />
    ) : (
      <ChatMessage
        replies={this.state.replies}
        key={msg.id}
        nestingLevel={nestingLevel}
        last={last}
        parent={parent}
        msg={msg}
        index={index}
        onReplySubmit={this.onReplySubmit}
      />
    );
  }
}

ChatroomContent.defaultProps = {
  showForm: true,
  showEditIcons: true,
  showLoading: true
};
ChatroomContent.propTypes = {
  limit: PropTypes.number,
  showLoading: PropTypes.bool,
  showForm: PropTypes.bool,
  showEditIcons: PropTypes.bool,
  state: PropTypes.string.isRequired,
  community: PropTypes.string.isRequired,
  lang: PropTypes.string.isRequired
};

export default ChatroomContent;
