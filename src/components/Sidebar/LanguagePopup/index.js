import React from "react";

import styles from "./index.scss";

import LANGUAGES, { isValid } from "../../../languages";

const LanguagePopup = ({ onChange }) => {
  return (
    <div className={styles.languagePopup}>
      {LANGUAGES.map(lang => (
        <div
          key={lang.value}
          className={styles.langItem}
          onClick={() => {
            onChange(lang.value);
          }}
        >
          {lang.name}
        </div>
      ))}
    </div>
  );
};

export default LanguagePopup;
