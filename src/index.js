import React from "react";

import "bootstrap/scss/bootstrap-reboot.scss";
import "bootstrap/scss/bootstrap-grid.scss";

import { BrowserRouter as Router, Route } from "react-router-dom";

import { IntlProvider } from "react-intl";

import Sidebar from "./components/Sidebar";
import Content from "./components/Content";
import ChatroomContent from "./components/ChatroomContent";
import styles from "./index.scss";

import messages from "./messages";

import io from "socket.io-client";

const socket = io(process.env.SERVER_URL);
global.socket = socket;

const App = () => {
  return (
    <Router>
      <div className={`${styles.app} container-fluid`}>
        <Route
          path="/:lang?/:city?/:community?"
          render={({ match, history }) => {
            const { lang, city, community } = match.params;
            const props = { history, lang, city, community };

            const msg = messages[lang];

            return (
              <IntlProvider locale="en" messages={msg}>
                <div className="row" style={{ height: "100%" }}>
                  <Sidebar {...props} />
                  {community ? (
                    <ChatroomContent {...props} />
                  ) : (
                    <Content {...props} />
                  )}
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
