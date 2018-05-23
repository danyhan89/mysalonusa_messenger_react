import React from "react";
import join from "@app/join";
import Label from "@app/Label";
import TabPanel from "@app/TabPanel";
import Overlay from "@app/Overlay";

import { withRouter } from "react-router-dom";

import PostBusinessForm from "../PostBusinessForm";
import JobList from "../JobList";
import BusinessOnSales from "../BusinessOnSales";
import FavoritesPage from "../FavoritesPage";
//
import Dashboard from "../Dashboard";

import ChatroomContent from "../ChatroomContent";

import styles from "./index.scss";

const heartIcon = (
  <svg className={styles.heart} width="24" height="24" viewBox="0 0 24 24">
    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
  </svg>
);

const TABS = {
  dashboard: 1,
  jobs: 2,
  chat: 3,
  businessOnSales: 4,
  postJob: 5,
  postBusiness: 6
};

class CenterContainer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      opened: false
    };
    this.toggleMenu = this.toggleMenu.bind(this);
  }

  toggleMenu(event) {
    requestAnimationFrame(() => {
      this.setState(
        {
          opened: !this.state.opened
        },
        () => {
          this.props.onToggle(this.state.opened);
        }
      );
    });
  }
  render() {
    const { props } = this;
    const { lang, state, community, className } = props;

    const children = this.renderChildren();
    return (
      <div
        className={join(
          className,
          this.state.opened ? styles.toggled : null,
          styles.centerContainer,
          "flex flex-column w-75-ns w-100 relative bg-white"
        )}
      >
        {children}
      </div>
    );
  }

  renderChildren() {
    const { props } = this;
    const { lang, state, community, match, location, history } = props;
    const key = `${community}-${state}-${lang}`;

    const children = <ChatroomContent {...props} key={key} />;
    const activeIndex = TABS[match.params.tab] || 1;

    return (
      <TabPanel
        className=""
        activeIndex={activeIndex}
        tabTitleClassName={index => {
          if (index == 0) {
            return "dn-ns";
          }
          if (index == 5) {
            // empty "pusher" tab
            return "flex-auto " + styles.pointerEventsNone;
          }
        }}
        onActivate={index => {
          let tab;
          Object.keys(TABS).map(key => {
            if (TABS[key] == index) {
              tab = key;
            }
          });

          if (tab) {
            history.push(`/${lang}/${state}/${community}/${tab}`);
          }
        }}
      >
        <div
          tabTitle={
            <div
              tabIndex={-1}
              onBlur={() => {
                if (this.state.opened) {
                  this.toggleMenu();
                }
              }}
              className={`${styles.menuButton}`}
              style={{ lineHeight: 0 }}
              onMouseDown={this.toggleMenu}
            >
              <div className="">
                <svg
                  height="32"
                  viewBox="0 0 24 24"
                  width="32"
                  className="mr2"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z" />
                </svg>
                <Label>menu</Label>
              </div>
            </div>
          }
        />
        <Dashboard {...props} tabTitle={<Label>dashboard</Label>} />
        <JobList
          state={state}
          community={community}
          tabTitle={<Label>jobs</Label>}
        />

        <div tabTitle={<Label>chatroom</Label>}>{children}</div>
        <BusinessOnSales
          state={state}
          community={community}
          tabTitle={<Label>businessOnSales</Label>}
        />
        <div />
        <FavoritesPage
          state={state}
          community={community}
          tabTitle={heartIcon}
        />
      </TabPanel>
    );
  }
}
export default withRouter(CenterContainer);
