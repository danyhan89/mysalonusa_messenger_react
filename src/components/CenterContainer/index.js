import React from "react";
import join from "@app/join";

import PostAJob from "../PostAJob";

import styles from "./index.scss";

export default ({ children, className, lang, state, community }) => {
  return (
    <div className={join(className, styles.centerContainer, 'flex flex-column w-75')}>
      {community && (
        <PostAJob lang={lang} state={state} community={community} />
      )}
      {children}
    </div>
  );
};
