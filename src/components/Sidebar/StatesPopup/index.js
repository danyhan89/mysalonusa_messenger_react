import React from "react";

import STATES from "src/states";

import styles from "./index.scss";

const StatesPopup = ({ onChange }) => {
  return (
    <div className={styles.statesPopup}>
      {STATES.map(state => (
        <div
          key={state}
          className={styles.stateItem}
          onClick={() => {
            onChange(state);
          }}
        >
          {state}
        </div>
      ))}
    </div>
  );
};

export default StatesPopup;
