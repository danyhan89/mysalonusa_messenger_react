import React from "react";

import LANGUAGES from "src/languages";

import styles from "./index.scss";

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
