import React from "react";
import Label from "@app/Label";
import join from "@app/join";
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
    <div className={`${styles.statesPopup}`}>
      <div
        className="flex items-center flex-column pa3 pa0-ns items-center justify-center"
        style={{ minHeight: "100%" }}
      >
        {STATES.map((state, index) => (
          <div
            key={state}
            className={join(styles.stateItem, " fl-ns w-50-ns pa3")}
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
    </div>
  );
};

export default StatesPopup;
