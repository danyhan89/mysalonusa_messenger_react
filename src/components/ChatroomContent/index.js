import React, { Component } from "react";
import PropTypes from "prop-types";
import styles from "./index.scss";

import communities from "src/communities";
import Label from "@app/Label";

const emptyFn = () => {};

class ChatroomContent extends Component {
  constructor(props) {
    super(props);

    this.onTextChange = this.onTextChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);

    const { lang, city, community } = props;

    socket.on("publish", message => {
      message = JSON.parse(message);
      if (message.city == city) {
        this.pushMessage(message);
      }
    });
    this.state = {
      text: "",
      messages: []
    };
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
    const { city } = this.props;

    global.socket.emit(
      "message",
      JSON.stringify({
        city,
        text,
        timestamp: Date.now()
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
          {this.state.messages.map(message => (
            <div key={message.timestamp}>{message.text}</div>
          ))}
        </div>
      </div>
    );
  }
}

ChatroomContent.propTypes = {
  city: PropTypes.string.isRequired,
  community: PropTypes.string.isRequired,
  lang: PropTypes.string.isRequired
};

export default ChatroomContent;
