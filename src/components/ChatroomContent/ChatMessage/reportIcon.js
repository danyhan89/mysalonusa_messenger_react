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
    <path d="M12.36 6l.4 2H18v6h-3.36l-.4-2H7V6h5.36M14 4H5v17h2v-7h5.6l.4 2h7V6h-5.6L14 4z" />
  </svg>
);
