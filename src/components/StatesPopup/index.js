import React from "react";
import Label from "@app/Label";
import join from "@app/join";
import MobileStepper from "@app/MobileStepper";
import STATES, { names } from "src/states";

import styles from "./index.scss";

const IMAGES = {
  ca:
    "https://s3.us-east-2.amazonaws.com/mysalonusa/uploads/cities/california.jpg",
  ny:
    "https://s3.us-east-2.amazonaws.com/mysalonusa/uploads/cities/newyork.jpg",
  il: "https://s3.us-east-2.amazonaws.com/mysalonusa/uploads/cities/chicago.jpg"
};

const StatesPopup = ({ onChange }) => {
  return (
    <div
      className={`${
        styles.statesPopup
      } flex-ns flex-column pa5 pa0-ns items-center justify-center`}
    >
      <div
        className="f2 b mt3 mb5 pv3 ph5  bg-yellow-primary"
        style={{ borderRadius: 24 }}
      >
        Please choose your state
      </div>
      <div className="flex flex-row justify-center">
        {STATES.map((state, index) => (
          <div
            key={state}
            className={join(styles.stateItem, " fl-ns pa3")}
            onClick={() => {
              onChange(state.toLowerCase());
            }}
          >
            <div
              className={join(
                "br3 overflow-hidden hidden aspect-ratio aspect-ratio--16x9 w-100",
                styles.stateImageWrapper
              )}
              style={{
                background: `url(${IMAGES[state.toLowerCase()]}) no-repeat`,
                backgroundPosition: "center",
                backgroundSize: "cover"
              }}
            >
              <div className={join("w-100 pa2", styles.overlay)}>
                {state} - {names[index]}
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="flex justify-center mt3">
        <MobileStepper style={{ width: 150 }} steps={3} activeStep={1} />
      </div>
    </div>
  );
};

export default StatesPopup;
