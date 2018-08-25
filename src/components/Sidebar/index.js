import React, { Component } from "react";

import { Redirect, NavLink, Link } from "react-router-dom";

import { isValid as isValidLang } from "src/languages";
import { isValid as isValidState } from "src/states";
import { isValid as isValidCommunity } from "src/communities";

import join from "@app/join";
import Label from "@app/Label";
import Circle from "@app/Circle";

import { quote, person, heartFull } from "src/components/icons";

import ChatroomSelect from "../ChatroomSelect";
import Footer from "../Footer";

import styles from "./index.scss";

const get = name => global.localStorage.getItem(name);
const remove = name => global.localStorage.removeItem(name);
const set = (name, value) => global.localStorage.setItem(name, value);

let storedLanguage = get("lang");
let storedState = get("state");
let storedCommunity = get("community");

if (!isValidLang(storedLanguage)) {
  storedLanguage = null;
  remove("lang");
}

if (!isValidState(storedState)) {
  storedState = null;
  remove("state");
}

const storeLanguage = lang => {
  if (isValidLang(lang)) {
    set("lang", lang);
    storedLanguage = lang;
  } else {
    remove("lang");
  }
};

const storeState = state => {
  if (isValidState(state)) {
    set("state", state);
    storedState = state;
  } else {
    remove("state");
  }
};

const storeCommunity = community => {
  if (isValidCommunity(community)) {
    set("community", community);
    storedCommunity = community;
  } else {
    remove("community");
  }
};
class Sidebar extends Component {
  constructor(props) {
    super(props);

    this.state = {
      opened: false
    };
  }
  componentDidMount() {
    this.maybeStoreLanguage(this.props);
    this.maybeStoreState(this.props);
    this.maybeStoreCommunity(this.props);
  }
  componentWillReceiveProps(nextProps) {
    this.maybeStoreLanguage(nextProps);
    this.maybeStoreState(nextProps);
    this.maybeStoreCommunity(nextProps);
  }
  maybeStoreLanguage(props) {
    if (props.lang && storedLanguage != props.lang) {
      storeLanguage(props.lang);
    }
  }
  maybeStoreState(props) {
    if (props.state && storedState != props.state) {
      storeState(props.state);
    }
  }
  maybeStoreCommunity(props) {
    if (props.community && storedCommunity != props.community) {
      storeCommunity(props.community);
    }
  }
  render() {
    const { lang, state, community } = this.props;

    if (!lang && storedLanguage) {
      return <Redirect to={`/${storedLanguage}`} />;
    }
    if (lang && !isValidLang(lang)) {
      return <Redirect to="/" />;
    }

    if (!state && storedState) {
      return <Redirect to={`/${lang}/${storedState}`} />;
    }
    if (state && !isValidState(state)) {
      return <Redirect to={`/${lang}`} />;
    }

    if (!community || !isValidCommunity(community)) {
      return <Redirect to={`/${lang}/${state}/${lang}`} />;
    }

    if (community != storedCommunity) {
      remove("community");

      if (isValidCommunity(community)) {
        storeCommunity(community);
        return <Redirect to={`/${lang}/${state}/${community}`} />;
      } else if (community) {
        return <Redirect to={`/${lang}/${state}`} />;
      }
    }

    const className = join(
      `top-0 bottom-0 overflow-auto w-75 w-25-ns flex flex-column fixed static-ns`,
      styles.sidebar,
      this.props.className,
      this.state.opened ? styles.opened : styles.closed
    );

    return (
      <div className={className}>
        {this.renderHeader()}
        {this.renderChatroomSelect()}
        <Footer {...this.props} />
      </div>
    );
  }

  renderHeader() {
    const { lang, state, community } = this.props;
    return (
      <div className={`flex flex-row ${styles.header} pa3 justify-between`}>
        <div
          className={`${
            styles.headerItem
          } mr1 f7 flex flex-column items-center`}
        >
          <Circle className={`${styles.circleIcon}  mb2`}>{person}</Circle>
          <Label>myCharacter</Label>
        </div>
        <div
          className={`${
            styles.headerItem
          } mr1 f7 flex flex-column items-center`}
        >
          <Circle className={`${styles.circleIcon}  mb2`}>{quote}</Circle>
          <Label>myChats</Label>
        </div>
        <NavLink
          to={`/${lang}/${state}/${community}/favorites`}
          className={`${
            styles.headerItem
          } mr1 f7 flex flex-column items-center`}
          activeClassName={styles.headerItemSelected}
        >
          <Circle className={`${styles.circleIcon}  mb2`}>{heartFull}</Circle>
          <Label>myFavorites</Label>
        </NavLink>
      </div>
    );
  }

  setOpened(opened) {
    this.setState({
      opened
    });
  }
  renderChatroomSelect() {
    const { history, lang, state, community } = this.props;
    if (!lang || !state) {
      return null;
    }
    return (
      <ChatroomSelect
        community={community}
        lang={lang}
        state={state}
        className={styles.chatroomSelect}
        onChange={community => {
          if (!community) {
            history.push(`/${lang}/${state}/`);
          } else {
            storeCommunity(community);
            history.push(`/${lang}/${state}/${community}`);
          }
        }}
      />
    );
  }
}

export default Sidebar;
