import React from "react";
import PropTypes from "prop-types";

import { renderHour } from "@app/dateUtils";
import join from "@app/join";

import styles from "./index.scss";

const Timestamp = ({ time }) => (
  <div className={join(styles.timestamp, "ttu f6 dib")}>{renderHour(time)}</div>
);

Timestamp.propTypes = {
  time: PropTypes.string.isRequired
};

export default Timestamp;
