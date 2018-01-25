import React from "react";

import join from "@app/join";
import Label from "@app/Label";
import Text from "@app/Text";

import communities from "src/communities";
import styles from "./index.scss";

const emptyFn = () => { };

const ChatroomSelect = ({
  onChange = emptyFn,
  state,
  community: currentCommunity,
  lang,
  ...props
}) => {
  return (
    <div {...props}>
      <div className="mb3">
        <Label values={{ state }}>welcome</Label>
      </div>
      <div className="mb2">
        <Label defaultMessage="Please select chatroom">selectChatroom</Label>
      </div>
      <div>
        {communities.map(community => {
          const isSelected = currentCommunity === community.value;

          return (
            <div
              key={community.value}
              className={join(
                'mb2 pa2 pl3',
                styles.communityItem,
                isSelected && styles.selectedCommunity
              )}
              onClick={() => {
                onChange(community.value);
              }}
              value={community.value}
            >
              {community.label} chatroom
            </div>
          );
        })}
        {currentCommunity && (
          <div onClick={() => onChange()} className="mt3"> Goto main page</div>
        )}
      </div>
    </div>
  );
};

export default ChatroomSelect;
