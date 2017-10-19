import React from "react";

import "bootstrap/scss/bootstrap-reboot.scss";
import "bootstrap/scss/bootstrap-grid.scss";

import { BrowserRouter as Router, Route } from "react-router-dom";

import { IntlProvider, FormattedMessage } from "react-intl";

import Sidebar from "./components/Sidebar";
import styles from "./index.scss";

import messages from "./messages";

const Content = () => {
  return <div className="col-8 col-md-10">col8</div>;
};

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
                  <FormattedMessage id="hello" values={{ name: "justin" }} />
                  Lang: {lang}
                  <Sidebar {...props} />
                  <Content {...props} />
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
