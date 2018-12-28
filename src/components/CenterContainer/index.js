import React from "react";
import join from "@app/join";
import Label from "@app/Label";
import TabPanel from "@app/TabPanel";
import Overlay from "@app/Overlay";

import { withRouter } from "react-router-dom";

import PostBusinessForm from "../PostBusinessForm";
import JobList, {
  registerFavoriteChange as registerFavoriteJobChange,
  getFavoriteJobs
} from "../JobList";
import BusinessOnSales, {
  registerFavoriteChange as registerFavoriteBusinessChange,
  getFavoriteBusinesses
} from "../BusinessOnSales";
import FavoritesPage from "../FavoritesPage";

//
import Dashboard from "../Dashboard";

import logoUrl from "src/images/logo.png";

import ChatroomContent from "../ChatroomContent";
import heartIcon from "./heartIcon";
import styles from "./index.scss";

const TABS = {
  chat: 2,
  jobs: 3,
  businessOnSales: 4,
  postJob: 6,
  favorites: 7
};

class CenterContainer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      opened: false,
      favoriteJobCount: Object.keys(getFavoriteJobs()).length,
      favoriteBusinessCount: Object.keys(getFavoriteBusinesses()).length
    };
    this.toggleMenu = this.toggleMenu.bind(this);
  }
  componentDidMount() {
    this.unregisterFavoriteJob = registerFavoriteJobChange(favoriteIds => {
      this.setState({
        favoriteJobCount: Object.keys(favoriteIds).length
      });
    });
    this.unregisterFavoriteBusiness = registerFavoriteBusinessChange(
      favoriteIds => {
        this.setState({
          favoriteBusinessCount: Object.keys(favoriteIds).length
        });
      }
    );
  }
  componentWillUnmount() {
    this.unregisterFavoriteJob();
    this.unregisterFavoriteBusiness();
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
    const activeIndex = TABS[match.params.tab] || TABS.chat;

    return (
      <TabPanel
        className=""
        activeIndex={activeIndex}
        tabTitleClassName={index => {
          if (index == 1) {
            return "dn-ns";
          }
          if (index == 6) {
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
          tabIndex={-1}
          tabTitle={<img src={logoUrl} style={{ maxWidth: 200 }} />}
        />
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
        {/* this is chatroom */}
        <div tabTitle={<Label>home</Label>}>{children}</div>
        <JobList
          state={state}
          community={community}
          tabTitle={<Label>jobs</Label>}
        />
        <BusinessOnSales
          state={state}
          community={community}
          tabTitle={<Label>businessOnSales</Label>}
        />
        <div />
      </TabPanel>
    );
  }
}
export default withRouter(CenterContainer);
