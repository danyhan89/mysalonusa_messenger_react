import React from "react";
import PropTypes from "prop-types";

import Input from "@app/Input";

import Label from "@app/Label";
import join from "@app/join";

import getDayFormat from "../getDayFormat";
import Separator from "../Separator";
import getNickname from "../getNickname";

import styles from "./index.scss";
import MessageAuthor from "./MessageAuthor";
import CommentIcon from "./commentIcon";
import BookmarkIcon from "./bookmarkIcon";
import ReportIcon from "./reportIcon";

const NESTING_DEPTH = 20;

const SHOW_MORE_REPLIES_PAGE_SIZE = 3;

const itsMe = message => {
  return message.nickname === getNickname();
};

const canEditMessage = () => {
  //todo fix this
  return false;
};

const canDeleteMessage = () => {
  //todo fix this
  return false;
};

const Avatar = () => {
  return (
    <div
      style={{ background: "gray", width: 40, height: 40 }}
      className="br3 dib flex-none mr3"
    />
  );
};

const ActionItem = ({ icon: Icon, ...props }) => {
  return (
    <a
      {...props}
      className={join("dib ph2 pointer", styles.actionLink, props.className)}
    >
      <Icon className="mr1" />
      {props.children}
    </a>
  );
};

class ChatMessage extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      replyToMap: {},
      limitMap: {}
    };
  }

  render() {
    const { nestingLevel, last, parent, msg, index } = this.props;
    return this.renderMessage({ nestingLevel, last, parent }, msg, index);
  }

  renderMessage({ nestingLevel, last, parent }, msg, index) {
    nestingLevel = nestingLevel || 0;

    const dateString = getDayFormat(msg.created_at);

    const dateSeparator =
      this.prevDate && this.prevDate != dateString ? (
        <Separator date={dateString} key={`${dateString}-separator`} />
      ) : null;

    this.prevDate = dateString;

    let renderResult;
    const me = itsMe(msg);
    const canEdit = canEditMessage(msg);
    const canDelete = canDeleteMessage(msg);

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
        : [];

    icons.push(<Avatar alias={alias} />);

    const { message: messageText } = msg;
    const alias = msg.alias;

    renderResult = (
      <div
        key={msg.id}
        data-key={msg.id}
        className={`mb3 flex-none relative w-100  ${
          differentAuthor ? "mt2" : ""
        } ${join(styles.chatMessage)}`}
      >
        {differentAuthor
          ? null && <MessageAuthor createdAt={msg.created_at} alias={alias} />
          : null}
        {
          <div
            style={{ marginLeft: nestingLevel * NESTING_DEPTH }}
            className={join(styles.message, me && styles.myMessage, "br2")}
          >
            <div
              className={join(
                "ph2 br2 relative dib f7 flex flex-row",
                styles.messageText
              )}
            >
              {icons}
              {messageText}
            </div>
          </div>
        }
        {this.renderReplies({ nestingLevel }, msg)}

        {this.renderHoverBubble({ nestingLevel, last, parent }, msg)}
        {this.renderReplyInput({ nestingLevel, last, parent }, msg)}
      </div>
    );

    if (dateSeparator) {
      delete this.lastAuthor;
    } else {
      this.lastAuthor = msg.nickname;
    }

    return dateSeparator ? [dateSeparator, renderResult] : renderResult;
  }

  renderReplyInput({ last, parent }, msg) {
    /*
    if (!this.state.replyingTo || this.state.replyingTo.id != msg.id) {
      return null;
    }*/
    const { replyToMap } = this.state;
    const replyTo = replyToMap[msg.id];

    if (!replyTo) {
      return null;
    }
    const { text, nestingLevel } = replyTo;
    /*
    let replyTo =
      replyTo && replyTo.id === msg.id
        ? replyTo
        : nestingLevel
          ? parent
          : msg;*/
    /*
    nestingLevel =
      replyTo && replyTo.id === msg.id
        ? this.state.replyToNesting
        : nestingLevel;*/

    return (
      <form
        onSubmit={this.onReplySubmit.bind(this, replyTo)}
        className={`${styles.form} pb2 ph2`}
      >
        <Input
          autoFocus={false}
          ref={this.replyInputRef}
          placeholder="Write a reply"
          onChange={this.onReplyTextChange.bind(this, replyTo)}
          value={text}
          style={{ marginLeft: (nestingLevel || 1) * NESTING_DEPTH }}
          className={`${styles.input} mt2 mr2`}
        />
      </form>
    );
  }

  onReplyToClick(msg, nestingLevel) {
    const replyToMap = {
      ...this.state.replyToMap,
      [msg.id]: {
        msg,
        text: "",
        nestingLevel: nestingLevel + 1
      }
    };
    this.setState({
      replyToMap
    });
  }

  renderHoverBubble({ nestingLevel, last, parent }, msg) {
    return (
      <div
        style={{ textAlign: "right", marginLeft: nestingLevel * NESTING_DEPTH }}
        className={join(styles.hoverBubble, "mt2")}
      >
        <ActionItem
          icon={CommentIcon}
          onClick={e => {
            e.preventDefault();
            this.onReplyToClick(msg, nestingLevel);
          }}
        >
          <Label>comment</Label>
        </ActionItem>
        <ActionItem icon={BookmarkIcon}>
          <Label>bookmark</Label>
        </ActionItem>

        <ActionItem icon={ReportIcon}>
          <Label>report</Label>
        </ActionItem>
      </div>
    );
  }

  showPrevReplies(msg, nextCount) {
    this.setState({
      limitMap: {
        ...this.state.limitMap,
        [msg.id]: nextCount
      }
    });
  }

  renderReplies({ nestingLevel } = {}, msg) {
    const { replies: allReplies } = this.props;
    const { limitMap } = this.state;

    const replies = allReplies ? allReplies[msg.id] : null;

    if (!replies || !replies.length) {
      return null;
    }

    const limit = limitMap[msg.id] || SHOW_MORE_REPLIES_PAGE_SIZE;
    const remainingCount = replies.length - limit;
    const nextCount =
      remainingCount > 0
        ? Math.min(SHOW_MORE_REPLIES_PAGE_SIZE, remainingCount)
        : 0;

    return [
      nextCount > 0 ? (
        <a
          key="ShowPrev"
          onClick={event => {
            event.preventDefault();
            this.showPrevReplies(msg, limit + nextCount);
          }}
        >
          Show {nextCount} more replies
        </a>
      ) : null,
      replies.slice(-limit).map((replyMessage, index, array) => {
        return this.renderMessage(
          {
            nestingLevel: nestingLevel + 1,
            last: index === array.length - 1,
            parent: msg
          },
          replyMessage,
          index,
          array
        );
      })
    ];
  }

  onReplySubmit(replyTo, event) {
    event.preventDefault();
    const { text, msg } = replyTo;
    this.props.onReplySubmit({ text, msg });

    const replyToMap = { ...this.state.replyToMap };
    delete replyToMap[msg.id];

    this.setState({
      replyToMap
    });
  }

  onReplyTextChange(replyTo, value) {
    const replyToMap = {
      ...this.state.replyToMap,
      [replyTo.msg.id]: { ...replyTo, text: value }
    };

    this.setState({
      replyToMap
    });
  }

  deleteMessage() {}

  editMessage() {}
}

ChatMessage.propTypes = {
  replies: PropTypes.array
};
export default ChatMessage;
