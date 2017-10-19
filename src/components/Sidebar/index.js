import React, { Component } from "react";

import { Redirect } from "react-router-dom";

import LanguagePopup from "./LanguagePopup";
import { isValid as isValidLang } from "../../languages";
import styles from "./index.scss";

const cities = ["NY", "LA", "Chicago"];

let storedLanguage = global.localStorage.getItem("lang");

if (!isValidLang(storedLanguage)) {
  storedLanguage = null;
  global.localStorage.removeItem("lang");
}

const storeLanguage = lang => {
  if (isValidLang(lang)) {
    global.localStorage.setItem("lang", lang);
  }
};

class Sidebar extends Component {
  componentDidMount() {
    this.maybeStoreLanguage(this.props);
  }
  componentWillReceiveProps(nextProps) {
    this.maybeStoreLanguage(nextProps);
  }
  maybeStoreLanguage(props) {
    if (props.lang && storedLanguage != props.lang) {
      storeLanguage(props.lang);
    }
  }
  render() {
    const { lang } = this.props;
    if (!lang && storedLanguage) {
      return <Redirect to={`/${storedLanguage}`} />;
    }
    if (lang && !isValidLang(lang)) {
      return <Redirect to="/" />;
    }
    return (
      <div className={`col-4 col-md-2 ${styles.sidebar}`}>
        {cities.map(city => <div key={city}>{city}</div>)}

        {this.renderLanguagePopup()}
      </div>
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
