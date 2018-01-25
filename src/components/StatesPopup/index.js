import React from "react";
import Label from '@app/Label'
import STATES, { names } from "src/states";

import styles from "./index.scss";

const StatesPopup = ({ onChange }) => {
  return (
    <div className={`${styles.statesPopup} flex items-center flex-column justify-center`}>
      <div className="mb3 f4">
        <Label>chooseState</Label>:
      </div>
      {STATES.map((state, index) => (
        <div
          key={state}
          className={styles.stateItem}
          onClick={() => {
            onChange(state);
          }}
        >
          {state} - {names[index]}
        </div>
      ))}
    </div>
  );
};

export default StatesPopup;
