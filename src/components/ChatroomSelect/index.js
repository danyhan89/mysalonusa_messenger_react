import React from "react";

import join from "@app/join";
import Label from "@app/Label";
import Text from "@app/Text";

import { pngFlags } from "src/components/LanguagePopup";

import communities, { getCommunity } from "src/communities";
import styles from "./index.scss";

const emptyFn = () => {};

const ChatroomSelect = ({
  onChange = emptyFn,
  state,
  community: currentCommunity,
  lang,
  ...props
}) => {
  return (
    <div {...props}>
      <div className={`${styles.welcome} fw3 pa2 f4 pv4`}>
        <Label
          values={{
            community: getCommunity(currentCommunity).label,
            state: state.toUpperCase()
          }}
        >
          welcome
        </Label>
      </div>
      <div className="mb2 fw4 ttu ph2 ">
        <Label defaultMessage="Please select chatroom">selectChatroom</Label>
      </div>
      <div className="ph2">
        {communities.map(community => {
          const isSelected = currentCommunity === community.value;
          const flag = pngFlags[community.value];
          return (
            <div
              key={community.value}
              className={join(
                "mb1 pa1 fw3",
                styles.communityItem,
                isSelected && styles.selectedCommunity
              )}
              onClick={() => {
                onChange(community.value);
              }}
              value={community.value}
            >
              <img src={flag} width={30} /> {community.label} chatroom
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ChatroomSelect;
