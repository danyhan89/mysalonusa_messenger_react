import React, { Component } from "react";
import styles from "./index.scss";

import communities from "src/communities";
import Label from "@app/Label";

const emptyFn = () => {};

class Content extends Component {
  render() {
    return (
      <div className={`col-8 col-md-10 ${styles.content}`}>main content</div>
    );
  }
}

export default Content;
