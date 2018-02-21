import React from "react";
import join from "@app/join";
import Label from "@app/Label";
import TabPanel from "@app/TabPanel";

import PostAJob from "../PostAJob";
import JobList from "../JobList";
//
import Content from "../Content";
import ChatroomContent from "../ChatroomContent";

import styles from "./index.scss";

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
    const { className, lang, state, community } = props;

    const key = `${community}-${state}-${lang}`;

    const children = community ? (
      <ChatroomContent {...props} key={key} />
    ) : (
      <Content {...props} />
    );
    return (
      <div
        className={join(
          className,
          this.state.opened ? styles.toggled : null,
          styles.centerContainer,
          "flex flex-column w-75-ns w-100 relative bg-white"
        )}
      >
        <TabPanel className="">
          <JobList
            state={state}
            community={community}
            tabTitle={<Label>jobs</Label>}
          />
          <div tabTitle="children">{children}</div>
          <div
            tabTitle={
              <div
                style={{
                  color: "red"
                }}
              >
                xxx
              </div>
            }
            style={{ color: "red" }}
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
      </div>
    );
  }
}
export default CenterContainer;
