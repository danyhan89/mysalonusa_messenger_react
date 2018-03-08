import React from "react";

import "bootstrap/scss/bootstrap-grid.scss";
import "tachyons/css/tachyons.css";

import { BrowserRouter as Router, Route } from "react-router-dom";

import { IntlProvider } from "react-intl";

import Sidebar from "./components/Sidebar";
import LanguagePopup from "./components/LanguagePopup";
import StatesPopup from "./components/StatesPopup";

import CenterContainer from "./components/CenterContainer";

import Footer from "./components/Footer";
import styles from "./index.scss";

import messages from "./messages";

const Layout = props => {
  return (
    <div className="flex flex-column" style={{ height: "100%" }}>
      <div className="flex-auto flex-ns flex-flow">
        <Sidebar {...props} />
        <CenterContainer {...props} />
      </div>
    </div>
  );
};

const App = () => {
  return (
    <Router>
      <div className={`${styles.app}`}>
        <Route
          path="/:lang?/:state?/:community?/:tab?"
          render={({ match, history }) => {
            let { lang, state, community } = match.params;
            if (lang) {
              lang = lang.toLowerCase();
            }
            if (state) {
              state = state.toLowerCase();
            }
            if (community) {
              community = community.toLowerCase();
            }

            const props = { history, lang, state, community };

            const msg = messages[lang];

            if (!lang) {
              return (
                <LanguagePopup
                  onChange={lang => {
                    history.push(`/${lang}`);
                  }}
                />
              );
            }

            let content;
            if (!state) {
              content = (
                <StatesPopup
                  onChange={state => {
                    history.push(`/${lang}/${state}`);
                  }}
                />
              );
            } else {
              content = <Layout {...props} />;
            }

            return (
              <IntlProvider locale="en" messages={msg}>
                {content}
              </IntlProvider>
            );
          }}
        />
      </div>
    </Router>
  );
};

export default App;
