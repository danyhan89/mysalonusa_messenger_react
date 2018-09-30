import React from "react";

import MobileStepper from "@app/MobileStepper";
import styles from "./index.scss";

const PopupScreen = ({ onChange, title, step, items }) => {
  return (
    <div
      className={`${
        styles.popupScreen
      } flex flex-column items-center pa3 pa2-ns justify-center`}
    >
      <div
        className={`${styles.title} f2 b mt3 mb5 pv3 ph5 tc bg-yellow-primary`}
        style={{ borderRadius: 24 }}
      >
        {title}
      </div>
      <div
        className={`${styles.popupItemContainer} flex flex-wrap justify-center`}
      >
        {items.map(item => (
          <div
            key={item.value}
            className={`${styles.popupItem} tc mb3 pa3 `}
            onClick={() => {
              onChange(item.value);
            }}
          >
            {item.render()}
          </div>
        ))}
      </div>
      <div className="flex justify-center mt5">
        <MobileStepper style={{ width: 150 }} steps={3} activeStep={step} />
      </div>
    </div>
  );
};

export default PopupScreen;
