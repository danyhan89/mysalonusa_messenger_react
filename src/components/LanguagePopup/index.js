import React from "react";

import Label from "@app/Label";
import MobileStepper from "@app/MobileStepper";
import LANGUAGES from "src/languages";

import usFlag from "src/images/us.png";
import koFlag from "src/images/kr.png";
import moFlag from "src/images/mn.png";
import voFlag from "src/images/vn.png";

import styles from "./index.scss";

export const pngFlags = {
  ko: koFlag,
  en: usFlag,
  vo: voFlag,
  mo: moFlag
};

const LanguagePopup = ({ onChange }) => {
  return (
    <div
      className={`${
        styles.languagePopup
      } flex-ns pa5 pa0-ns items-center justify-center`}
    >
      <div>
        <div
          className="f2 b mt3 mb5 pv3 ph5  bg-yellow-primary"
          style={{ borderRadius: 24 }}
        >
          Please choose your language
        </div>
        <div className="flex flex-row justify-center">
          {LANGUAGES.map(lang => (
            <div
              key={lang.value}
              className={`${styles.langItem} mb3 fl-ns pa3 `}
              onClick={() => {
                onChange(lang.value);
              }}
            >
              <div
                className="mb2 aspect-ratio aspect-ratio--16x9 w-100"
                style={{
                  background: `url(${pngFlags[lang.value]}) no-repeat`,
                  backgroundPosition: "center",
                  backgroundSize: "cover"
                }}
              />
              {lang.name}
            </div>
          ))}
        </div>
        <div className="flex justify-center mt3">
          <MobileStepper style={{ width: 150 }} steps={3} activeStep={0} />
        </div>
      </div>
    </div>
  );
};

export default LanguagePopup;
