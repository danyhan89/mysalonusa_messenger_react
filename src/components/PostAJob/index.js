import React, { Component } from "react";

import join from "@app/join";
import Label from "@app/Label";
import Overlay from "@app/Overlay";

import PostJobForm from "./PostJobForm";

import styles from "./index.scss";

const stopPropagation = e => e.stopPropagation();

class PostAJob extends Component {
  constructor(props) {
    super(props);

    this.state = {
      on: false
    };
    this.toggle = this.toggle.bind(this);
  }
  toggle() {
    this.setState({
      on: !this.state.on
    });
  }
  render() {
    const { props } = this;
    const className = join(props.className, styles.container, "flex items-center  f4 white");

    return (
      <div className={className}>
        <div tabIndex={-1} onBlur={this.props.toggleMenu} className={`pa3 dib dn-ns ${styles.menuButton}`} style={{ lineHeight: 0 }} onMouseDown={this.props.toggleMenu}>
          <svg height="24" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg">
            <path d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z" />
          </svg>
        </div>
        <div className={`${styles.postAJob} ph2 pa3-ns`} onClick={this.toggle}>
          {this.renderOverlay()}<Label>postAJob</Label>
        </div>
      </div>
    );
  }

  renderOverlay() {
    if (!this.state.on) {
      return null;
    }

    const { lang, state, community } = this.props;
    return (
      <Overlay
        closeable
        onClose={() => {
          this.setState({ on: false });
        }}
      >
        <PostJobForm
          onSuccess={() => {
            this.setState({
              on: false
            });
          }}
          lang={lang}
          state={state}
          community={community}
        />
      </Overlay>
    );
  }
}
export default PostAJob;
