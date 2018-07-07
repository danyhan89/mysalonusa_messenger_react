import React from "react";
import join from "@app/join";

import styles from "./index.scss";

export default class Circle extends React.Component {
  render() {
    const { size, center, ...props } = this.props;
    const className = join(
      center ? "flex flex-row items-center justify-center" : "",
      props.className,
      styles.circle
    );
    return (
      <div
        {...props}
        className={className}
        style={{ width: size, height: size, ...props.style }}
      />
    );
  }
}

Circle.defaultProps = {
  size: 40,
  center: true
};
