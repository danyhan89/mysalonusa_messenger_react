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
      // flex-column { flex-direction: column }
      <div className="flex flex-column" style={{ height: "100%" }}>
        <div
          className="relative flex-auto flex-ns flex-flow"
          style={{ height: "100%" }}
        >
          {/* 
            flex-ns (not small screen only){display: flex}
            flex-auto { flex: 1 1 auto }
            flex-flow { shorthand for both flex-direction & flex-wrap properties }
            default for flex-direction: row
            default for flex-wrap: nowrap
           */}
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
          // render is used to send in props to component
          // when component is rendered by React router, that component is passed
          // 3 different props - location, match, history
          // history pushes new entry onto history stack - aka redirecting user to another route
          // history push == <Redirect />
          // history push re-renders <Router> component
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
                msg={msg}
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
