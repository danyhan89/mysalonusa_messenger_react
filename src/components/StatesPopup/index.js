import React from "react";
import join from "@app/join";

import STATES, { names } from "src/states";

import PopupScreen from "../PopupScreen";

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
    <PopupScreen
      title="Please choose your state"
      onChange={onChange}
      step={1}
      items={STATES.map((state, index) => {
        return {
          value: state.toLowerCase(),
          render: () => {
            return (
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
            );
          }
        };
      })}
    />
  );
};

export default StatesPopup;
