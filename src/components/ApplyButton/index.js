import React from "react";
import Label from "@app/Label";

import APPLY_ICON from "./applyIcon";

import styles from "./index.scss";

export default ({ onClick, className, size = 24, label }) => (
  <div
    onClick={onClick}
    className={`${className || ""} br2 pa1 fw300 inline-flex items-center ${
      styles.apply
    }`}
  >
    {APPLY_ICON({ size })} {label || <Label>APPLY</Label>}
  </div>
);
