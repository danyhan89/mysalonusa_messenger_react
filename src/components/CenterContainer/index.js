import React from "react";
import join from "@app/join";
import Label from "@app/Label";
import TabPanel from "@app/TabPanel";
import Overlay from "@app/Overlay";

import { withRouter } from "react-router-dom";

import PostJobForm from "../PostAJob/PostJobForm";
import JobList from "../JobList";
//
import Dashboard from "../Dashboard";

import ChatroomContent from "../ChatroomContent";

import styles from "./index.scss";

const TABS = {
  dashboard: 1,
  jobs: 2,
  chat: 3,
  postJob: 5
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
      this.setState({
        opened: !this.state.opened
      });
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
        {this.state.showPostJob ? (
          <Overlay
            closeable
            onClose={() => {
              this.setState({ showPostJob: false });
            }}
          >
            <PostJobForm
              onSuccess={() => {
                this.setState({ showPostJob: false });
              }}
              lang={lang}
              state={state}
              community={community}
            />
          </Overlay>
        ) : null}
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
        }}
        onActivate={index => {
          let tab;
          Object.keys(TABS).map(key => {
            if (TABS[key] == index) {
              tab = key;
            }
          });

          if (tab == "postJob") {
            this.setState({
              showPostJob: true
            });
            return;
          }

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
                  this.toggleMenu()
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
        <div tabTitle={<Label>businessOnSale</Label>}>tab one</div>
        <div tabTitle={<Label>postAJob</Label>} />
      </TabPanel>
    );
  }
}
export default withRouter(CenterContainer);
