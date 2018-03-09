import React, { Component } from "react";
import PropTypes from "prop-types";
import { findDOMNode } from "react-dom";

import { DateTime } from "luxon";

import io from "socket.io-client";
import uuidv4 from "uuid/v4";

import communities from "src/communities";

import LoadingIcon from "@app/LoadingIcon";
import Label from "@app/Label";
import join from "@app/join";
import Input from "@app/Input";
import Button from "@app/Button";
import ActionButton from "@app/ActionButton";
import Overlay from "@app/Overlay";
import Popup from "@app/Popup";

import { incrementJobView, fetchChats } from "src/api";

import ApplyButton from "src/components/ApplyButton";

import { isValid as isValidState } from "src/states";

import Separator from "./Separator";
import Job from "./Job";
import JOB_ICON from "./jobIcon";
import DELETE_ICON from "./deleteIcon";
import EDIT_ICON from "./editIcon";

import ApplyOverlay from "../ApplyOverlay";
import PostJobForm from "../PostAJob/PostJobForm";

import styles from "./index.scss";

const STORED_NICKNAME = global.localStorage.getItem("nickname");
let STORED_ALIAS = global.localStorage.getItem("alias");

const NICKNAME = STORED_NICKNAME || uuidv4();
if (!STORED_NICKNAME) {
  global.localStorage.setItem("nickname", NICKNAME);
}

const emptyFn = () => {};

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

const timezoneOffset = new Date().getTimezoneOffset();

const renderDate = dateString => {
  const date = DateTime.fromISO(dateString).plus({ minutes: -timezoneOffset });

  return date.toLocaleString(DateTime.DATETIME_SHORT);
};

const renderHour = dateString => {
  const date = DateTime.fromISO(dateString).plus({ minutes: -timezoneOffset });

  return date.toLocaleString(DateTime.TIME_SIMPLE);
};

const getDayFormat = dateString => {
  const date = DateTime.fromISO(dateString).plus({ minutes: -timezoneOffset });

  return date.toLocaleString();
};

global.DateTime = DateTime;

class ChatroomContent extends Component {
  constructor(props) {
    super(props);

    this.onTextChange = this.onTextChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
    this.renderMessage = this.renderMessage.bind(this);
    this.onMessagesScroll = this.onMessagesScroll.bind(this);

    const { state: chosenState } = props;

    this.beforeId = null;

    this.inputRef = cmp => {
      this.inputNode = cmp ? findDOMNode(cmp) : null;
    };

    this.openSocket(chosenState);

    this.state = {
      loading: true,
      alias: "",
      text: "",
      skip: 0,
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
    }).then(chats => {
      chats = chats.reverse();
      const messages = chats.concat(this.state.messages);

      //const viewViews = messages.filter
      this.setState(
        {
          loading: false,
          messages
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

  componentDidMount() {
    const { props } = this;

    fetchChats({
      limit: this.props.limit || LIMIT,
      state: props.state,
      community: props.community
    }).then(chats => {
      this.setState(
        {
          loading: false,
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
      });
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
      () => {
        if (this.itsMe(message)) {
          this.scrollToBottom();
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
    const { editMessage } = this.state;

    if (editMessage) {
      const newMessage = {
        ...editMessage,
        message: text
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
    return message.nickname === NICKNAME;
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
      <ApplyOverlay
        job={job}
        onDismiss={() => {
          this.setState({
            applyForJob: null
          });
        }}
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
          {!empty ? this.state.messages.map(this.renderMessage) : null}
        </div>
        {this.renderAliasOverlay()}
        {this.renderDeletePopup()}
        {this.renderApplyOverlay()}
        {this.renderJobEditOverlay()}
        {this.renderJobViewOverlay()}
        {this.props.showForm ? (
          <form onSubmit={this.onSubmit} className={`${styles.form} pb2 ph2`}>
            <Input
              ref={this.inputRef}
              placeholder="Your message"
              onChange={this.onTextChange}
              value={this.state.text}
              className={`${styles.input} mt2 mr2`}
            />
            <Button disabled={!this.state.text} className={`br2 ph2 mt2`}>
              <Label>Send</Label>
            </Button>
          </form>
        ) : null}
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
      <Overlay
        closeable
        onClose={() => {
          this.setState({ jobToView: null });
        }}
      >
        <PostJobForm
          step="apply"
          defaultValues={job}
          onApplyClick={() => {
            this.setState({
              jobToView: null
            });
            this.onApply(job, this.state.jobToViewMessage);
          }}
          lang={this.props.lang}
          state={this.props.state}
          community={this.props.community}
        />
      </Overlay>
    );
  }

  onViewJob(job, msg) {
    this.updateJobViews(job, msg);
    this.setState({
      jobToView: job,
      jobToViewMessage: msg
    });
  }

  renderJobMessage(job, msg, children) {
    const itsMe = this.itsMe(msg);
    const timestamp = this.renderTimestamp(msg);

    return (
      <Job
        key={job.id || index}
        job={job}
        onViewClick={this.onViewJob.bind(this, job, msg)}
        onApplyClick={this.onApply.bind(this, job, msg)}
      />
    );
    return (
      <div
        key={job.id || index}
        style={{ maxHeight: "30vh", overflow: "auto" }}
        className={join(`mt2`, itsMe && styles.flexEnd)}
      >
        {job.nickname || <Label>unknown</Label>}
        {timestamp}
        <div
          className={join(
            "br2 pa2 relative",

            styles.jobMessage,
            styles.message,
            itsMe && styles.myMessage,
            itsMe ? "ml5" : null
          )}
        >
          <div className="f4 f3-ns flex items-center">
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
            <ApplyButton onClick={this.onApply.bind(this, job, msg)} />
          ) : null}

          {children}
        </div>
      </div>
    );
  }

  isJob(message) {
    return message.chat_type == 1;
  }

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

  renderTimestamp(msg) {
    const timestamp = (
      <div className={join(styles.timestamp, "ttu f6 dib")}>
        {renderHour(msg.created_at)}
      </div>
    );

    return timestamp;
  }

  renderMessage(msg, index) {
    const isJob = this.isJob(msg);

    const dateString = getDayFormat(msg.created_at);

    const dateSeparator =
      this.prevDate && this.prevDate != dateString ? (
        <Separator date={dateString} key={`${dateString}-separator`} />
      ) : null;

    this.prevDate = dateString;

    let renderResult;
    const key = msg.id || index;
    const me = this.itsMe(msg);
    const canEdit = this.canEditMessage(msg);
    const canDelete = this.canDeleteMessage(msg);
    const differentAuthor = this.lastAuthor != msg.nickname;

    const icons =
      me && this.props.showEditIcons
        ? [
            DELETE_ICON({
              size: 24,
              onClick: this.deleteMessage.bind(this, msg),
              className: `${styles.deleteIcon} ${
                !canDelete ? "o-50" : ""
              } absolute top-0 left-0`
            }),
            EDIT_ICON({
              size: 24,
              onClick: this.editMessage.bind(this, msg),
              className: `${styles.editIcon} ${
                !canEdit ? "o-50" : ""
              } absolute top-0 left-0`
            })
          ]
        : null;

    if (isJob) {
      renderResult = this.renderJobMessage(JSON.parse(msg.message), msg, icons);
    } else {
      const timestamp = (
        <div className={join(styles.timestamp, "ttu f6 dib")}>
          {renderHour(msg.created_at)}
        </div>
      );

      const { message, nickname, alias } = msg;
      renderResult = [
        differentAuthor ? (
          <div>
            <div key="author" className="b dib">
              {alias || <Label>unknown</Label>}
            </div>{" "}
            {timestamp}
          </div>
        ) : null,
        <div
          key="msg"
          className={join(styles.message, me && styles.myMessage, "br2")}
        >
          <div className={join("pv1 ph2 br2 relative dib", styles.messageText)}>
            {icons}
            {me ? timestamp : null}
            {message}
          </div>
          {!me ? timestamp : null}
        </div>
      ];
    }

    renderResult = (
      <div
        key={key}
        className={`relative w-100 ${differentAuthor ? "mt2" : ""} ${join(
          me && styles.flexEnd
        )}`}
      >
        {renderResult}
      </div>
    );

    this.lastAuthor = msg.nickname;

    return dateSeparator ? [dateSeparator, renderResult] : renderResult;
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
