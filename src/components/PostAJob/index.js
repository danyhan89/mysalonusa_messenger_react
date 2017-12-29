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
    const className = join(props.className, styles.postAJob, 'pa3 f4');

    return (
      <div className={className} onClick={this.toggle}>
        {this.renderOverlay()}Post a job
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
