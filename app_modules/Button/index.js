import React from "react";

import join from "@app/join";

import styles from "./index.scss";

const stopPropagation = e => e.stopPropagation();

const Button = ({ type, className, disabled, ...props }) => {
  return (
    <button
      {...props}
      type={type || "submit"}
      disabled={disabled}
      className={join(
        `${styles.button} pointer br2 ph2 `,
        className,
        disabled && styles.disabled
      )}
    />
  );
};
export default Button;
