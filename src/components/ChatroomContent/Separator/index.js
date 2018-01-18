import React from "react";
import styles from "./index.scss";
export default ({ date }) => (
  <div className={`${styles.separator} w-100 tc relative`}>
    <div className={`${styles.separatorLine} w-100 absolute`} />

    <div className={`${styles.separatorContentWrapper} pa2 dib`}>
      <div className={`${styles.separatorContent} br3 pa2 dib`}>{date}</div>
    </div>
  </div>
);
