import React from "react";
import PropTypes from "prop-types";

import Label from "@app/Label";
import Timestamp from "../Timestamp";

import styles from "./index.scss";

const MessageAuthor = ({ createdAt, alias }) => (
  <div>
    <div className={`b dib mr3 ${styles.nickname}`}>
      {alias || <Label>unknown</Label>}
    </div>{" "}
    <Timestamp time={createdAt} />
  </div>
);

MessageAuthor.propTypes = {
  createdAt: PropTypes.string,
  alias: PropTypes.string
};

export default MessageAuthor;
