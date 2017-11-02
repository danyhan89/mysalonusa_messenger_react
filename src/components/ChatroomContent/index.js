import React, { Component } from "react";
import PropTypes from "prop-types";
import styles from "./index.scss";

import communities from "src/communities";
import Label from "@app/Label";

const emptyFn = () => {};

class ChatroomContent extends Component {
  render() {
    return (
      <div className={`col-8 col-md-10 ${styles.content}`}>
        chatroom content
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
