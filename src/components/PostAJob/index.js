import React, { Component } from "react";

import join from "@app/join";
import Label from "@app/Label";

import PostJobForm from "./PostJobForm";

import styles from "./index.scss";

const stopPropagation = e => e.stopPropagation();

const renderCloseIcon = ({ onClick }) => (
  <div onClick={onClick} className={styles.closeIcon}>
    <svg
      height="44"
      width="44"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
      <path d="M0 0h24v24H0z" fill="none" />
    </svg>
    <div>
      <Label>close</Label>
    </div>
  </div>
);

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
        {renderCloseIcon({
          onClick: () => {
            this.setState({ on: false });
          }
        })}
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
