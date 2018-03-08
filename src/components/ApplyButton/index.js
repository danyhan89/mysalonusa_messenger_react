import React from "react";
import Label from "@app/Label";

import APPLY_ICON from "./applyIcon";
import styles from "./index.scss";

export default ({ onClick, className, size = 24 }) => (
  <div
    onClick={onClick}
    className={`${className ||
      ""} br3 pa1 fw300 inline-flex items-center ${styles.apply}`}
  >
    {APPLY_ICON({ size })} <Label>APPLY</Label>
  </div>
);
