import React from "react";

import join from "@app/join";

import styles from "./index.scss";

const ShadowBox = ({ children, flex = true }) => (
  <div className={join(styles.shadowBox, flex ? "flex" : "", "pa4 ph4 br3")}>
    {children}
  </div>
);

export default ShadowBox;
