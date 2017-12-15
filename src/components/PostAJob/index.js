import React, { Component } from "react";

import join from "@app/join";

import PostJobForm from "./PostJobForm";

import styles from "./index.scss";

const stopPropagation = e => e.stopPropagation();

const Overlay = ({ children }) => {
  return (
    <div onClick={stopPropagation} className={styles.overlay}>
      {children}
    </div>
  );
};

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
    const className = join(props.className, styles.postAJob);

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
      <Overlay>
        <PostJobForm onSuccess={() => {
          this.setState({
            on: false
          })
        }} lang={lang} state={state} community={community} />
      </Overlay>
    );
  }
}
export default PostAJob;
