import React from "react";
import join from "@app/join";

import PostAJob from "../PostAJob";

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
    const { children, className, lang, state, community } = this.props;

    return (
      <div
        className={join(
          className,
          this.state.opened ? styles.toggled : null,
          styles.centerContainer,
          "flex flex-column w-75-ns w-100 relative bg-white"
        )}
      >
        {community && (
          <PostAJob
            toggleMenu={this.toggleMenu}
            lang={lang}
            state={state}
            community={community}
          />
        )}
        {children}
      </div>
    );
  }
}
export default CenterContainer;
