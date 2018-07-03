import React from "react";

import "bootstrap/scss/bootstrap-grid.scss";
import "tachyons/css/tachyons.css";

import { BrowserRouter as Router, Route, Switch } from "react-router-dom";

import { IntlProvider } from "react-intl";

import AdminPage from "./components/AdminPage";
import Sidebar from "./components/Sidebar";
import LanguagePopup from "./components/LanguagePopup";
import StatesPopup from "./components/StatesPopup";

import CenterContainer from "./components/CenterContainer";

import messages from "./messages";

class Layout extends React.Component {
  constructor(props) {
    super(props);

    this.sidebarRef = c => {
      this.sidebar = c;
    };
  }
  render() {
    return (
      <div className="flex flex-column" style={{ height: "100%" }}>
        <div
          className="relative flex-auto flex-ns flex-flow"
          style={{ height: "100%" }}
        >
          <Sidebar {...this.props} ref={this.sidebarRef} />
          <CenterContainer
            {...this.props}
            onToggle={opened => {
              this.sidebar.setOpened(opened);
            }}
          />
        </div>
      </div>
    );
  }
}

export default () => (
  <Router>
    <Switch>
      <Route path="/admin/login" component={AdminPage} />

      <Route path="/admin" component={AdminPage} />
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
    </Switch>
  </Router>
);
