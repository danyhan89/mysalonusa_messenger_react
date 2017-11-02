import React, { Component } from "react";

import { Redirect } from "react-router-dom";

import { isValid as isValidLang } from "src/languages";
import { isValid as isValidCity } from "src/cities";
import { isValid as isValidCommunity } from "src/communities";

import LanguagePopup from "./LanguagePopup";
import CitiesPopup from "./CitiesPopup";
import ChatroomSelect from "../ChatroomSelect";

import styles from "./index.scss";

const get = name => global.localStorage.getItem(name);
const remove = name => global.localStorage.removeItem(name);
const set = (name, value) => global.localStorage.setItem(name, value);

let storedLanguage = get("lang");
let storedCity = get("city");
let storedCommunity = get("community");

if (!isValidLang(storedLanguage)) {
  storedLanguage = null;
  remove("lang");
}

if (!isValidCity(storedCity)) {
  storedCity = null;
  remove("city");
}

const storeLanguage = lang => {
  if (isValidLang(lang)) {
    set("lang", lang);
    storedLanguage = lang;
  } else {
    remove("lang");
  }
};

const storeCity = city => {
  if (isValidCity(city)) {
    set("city", city);
    storedCity = city;
  } else {
    remove("city");
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
  componentDidMount() {
    this.maybeStoreLanguage(this.props);
    this.maybeStoreCity(this.props);
    this.maybeStoreCommunity(this.props);
  }
  componentWillReceiveProps(nextProps) {
    this.maybeStoreLanguage(nextProps);
    this.maybeStoreCity(nextProps);
    this.maybeStoreCommunity(nextProps);
  }
  maybeStoreLanguage(props) {
    if (props.lang && storedLanguage != props.lang) {
      storeLanguage(props.lang);
    }
  }
  maybeStoreCity(props) {
    if (props.city && storedCity != props.city) {
      storeCity(props.city);
    }
  }
  maybeStoreCommunity(props) {
    if (props.community && storedCommunity != props.community) {
      storeCommunity(props.community);
    }
  }
  render() {
    const { lang, city, community } = this.props;

    if (!lang && storedLanguage) {
      return <Redirect to={`/${storedLanguage}`} />;
    }
    if (lang && !isValidLang(lang)) {
      return <Redirect to="/" />;
    }

    if (!city && storedCity) {
      return <Redirect to={`/${lang}/${storedCity}`} />;
    }
    if (city && !isValidCity(city)) {
      return <Redirect to={`/${lang}`} />;
    }

    if (community && !isValidCommunity(community)) {
      return <Redirect to={`/${lang}/${city}`} />;
    }

    if (community != storedCommunity) {
      remove("community");

      if (isValidCommunity(community)) {
        storeCommunity(community);
        return <Redirect to={`/${lang}/${city}/${community}`} />;
      } else if (community) {
        return <Redirect to={`/${lang}/${city}`} />;
      }
    }

    return (
      <div className={`col-4 col-md-2 ${styles.sidebar}`}>
        {this.renderLanguagePopup()}
        {this.renderCitiesPopup()}
        {this.renderChatroomSelect()}
      </div>
    );
  }
  renderChatroomSelect() {
    const { history, lang, city, community } = this.props;
    if (!lang || !city) {
      return null;
    }
    return (
      <ChatroomSelect
        community={community}
        lang={lang}
        city={city}
        onChange={community => {
          if (!community) {
            history.push(`/${lang}/${city}/`);
          } else {
            storeCommunity(community);
            history.push(`/${lang}/${city}/${community}`);
          }
        }}
      />
    );
  }
  renderCitiesPopup() {
    const { history, lang, city } = this.props;
    if (!lang) {
      return null;
    }

    if (city) {
      return null;
    }

    return (
      <CitiesPopup
        onChange={city => {
          history.push(`/${lang}/${city}`);
        }}
      />
    );
  }
  renderLanguagePopup() {
    if (this.props.lang) {
      return null;
    }

    const { history } = this.props;

    return (
      <LanguagePopup
        onChange={lang => {
          history.push(`/${lang}`);
        }}
      />
    );
  }
}

export default Sidebar;
