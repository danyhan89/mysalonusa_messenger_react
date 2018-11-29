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
    <path d="M17 3H7c-1.1 0-2 .9-2 2v16l7-3 7 3V5c0-1.1-.9-2-2-2zm0 15l-5-2.18L7 18V5h10v13z" />
  </svg>
);
