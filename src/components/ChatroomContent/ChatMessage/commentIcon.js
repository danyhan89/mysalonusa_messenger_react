import React from "react";

export default ({ size = 18, style, ...props } = { size: 24 }) => (
  <svg
    {...props}
    style={{
      verticalAlign: "middle",
      fill: "currentColor",
      position: "relative",
      top: -2,
      ...style
    }}
    height={size || 24}
    viewBox="0 0 24 24"
    width={size || 24}
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M20 17.17L18.83 16H4V4h16v13.17zM20 2H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h14l4 4V4c0-1.1-.9-2-2-2z" />
  </svg>
);
