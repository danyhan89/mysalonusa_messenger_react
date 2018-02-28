import React from "react";
import join from "@app/join";
import Label from "@app/Label";
import TabPanel from "@app/TabPanel";

import { withRouter } from "react-router-dom";

import PostAJob from "../PostAJob";
import JobList from "../JobList";
//
import Dashboard from "../Dashboard";
import ChatroomContent from "../ChatroomContent";

import styles from "./index.scss";

const TABS = {
  jobs: 0,
  chat: 1
}

class CenterContainer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      opened: false
    };
    this.toggleMenu = this.toggleMenu.bind(this);
  }

  toggleMenu() {
    requestAnimationFrame(() => {
      this.setState({
        opened: !this.state.opened
      });
    });
  }
  render() {
    const { props } = this;
    const { className } = props;

    const children = this.renderChildren()
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
    const { props } = this
    const { lang, state, community, match, location, history } = props;
    const key = `${community}-${state}-${lang}`;

    console.log({ community })
    if (!community) {
      return <Dashboard {...props} />
    }
    const children = (
      <ChatroomContent {...props} key={key} />
    )
    const activeIndex = TABS[match.params.tab] || 0

    return <TabPanel className="" activeIndex={activeIndex} onActivate={(index) => {
      let tab
      Object.keys(TABS).map(key => {
        if (TABS[key] == index) {
          tab = key
        }
      })

      if (tab) {
        history.push(`/${lang}/${state}/${community}/${tab}`)
      }
    }}>
      <JobList
        state={state}
        community={community}
        tabTitle={<Label>jobs</Label>}
      />
      <div tabTitle={<Label>chatroom</Label>}>{children}</div>
      <div
        tabTitle={
          <Label>businessOnSale</Label>
        }
      >
        tab one
      </div>
      <div tabTitle="2" style={{ color: "blue" }}>
        tab two
      </div>
      <div tabTitle="3">tab three</div>
      {community ? (
        <PostAJob
          tabTitle={<Label>postAJob</Label>}
          toggleMenu={this.toggleMenu}
          lang={lang}
          state={state}
          community={community}
        />
      ) : null}
    </TabPanel>
  }
}
export default withRouter(CenterContainer);
