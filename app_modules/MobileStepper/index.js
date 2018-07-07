import React, { cloneElement } from "react";
import join from "@app/join";
import { pinkPrimary } from "@app/colors";

const defaultRenderStep = ({ active, color = pinkPrimary }) => {
  return (
    <div
      style={{
        width: 15,
        height: 15,
        borderRadius: "50%",
        background: active ? color : "transparent",
        border: `3px solid ${color}`
      }}
    />
  );
};
export default ({
  steps = 3,
  activeStep = 0,
  renderStep = defaultRenderStep,
  ...props
}) => (
  <div
    {...props}
    className={join(props.className, "flex flex-row justify-between")}
  >
    {[...new Array(steps)].map((_, index) => {
      const step = renderStep({ index, active: activeStep === index });

      return cloneElement(step, {
        key: index
      });
    })}
  </div>
);
