import React from "react";

import "bootstrap/scss/bootstrap-grid.scss";
import "tachyons/css/tachyons.css";

import { BrowserRouter as Router, Route } from "react-router-dom";

import { IntlProvider } from "react-intl";

import Sidebar from "./components/Sidebar";
import Content from "./components/Content";
import CenterContainer from "./components/CenterContainer";
import ChatroomContent from "./components/ChatroomContent";
import styles from "./index.scss";

import messages from "./messages";

const App = () => {
  return (
    <Router>
      <div className={`${styles.app} container-fluid`}>
        <Route
          path="/:lang?/:state?/:community?"
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

            return (
              <IntlProvider locale="en" messages={msg}>
                <div className="row" style={{ height: "100%" }}>
                  <Sidebar {...props} />
                  <CenterContainer {...props}>
                    {community ? (
                      <ChatroomContent {...props} key={community} />
                    ) : (
                      <Content {...props} />
                    )}
                  </CenterContainer>
                </div>
              </IntlProvider>
            );
          }}
        />
      </div>
    </Router>
  );
};

export default App;
