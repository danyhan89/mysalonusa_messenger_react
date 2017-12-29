import React, { Component } from "react";

import isEmail from "is-email";

import Overlay from "@app/Overlay";
import Label from "@app/Label";
import join from "@app/join";
import Input from "@app/Input";
import ActionButton from "@app/ActionButton";
import LoadingIcon from "@app/LoadingIcon";

import { applyForJob } from "src/api";

import JOB_ICON from "../jobIcon";
import APPLY_ICON from "../applyIcon";

import styles from "./index.scss";

class ApplyOverlay extends Component {
  constructor(props) {
    super(props);

    this.state = {
      message: "1234567891234567819",
      email: "test@test.",
      sending: false
    };
  }

  isSendDisabled() {
    return this.state.message.length < 20 || !isEmail(this.state.email);
  }

  onSend() {
    if (this.isSendDisabled()) {
      return;
    }

    this.setState({
      sending: true
    });

    const { message, email } = this.state;
    const { job } = this.props;
    applyForJob({
      message,
      job,
      email
    })
      .then(({ error, success }) => {
        if (!success) {
          throw error;
        }
        this.setState({
          sending: false
        });

        this.props.onDismiss();
      })
      .catch(() => {
        this.setState({
          sending: false
        });
      });
  }
  render() {
    const { props } = this;

    const { onDismiss, job } = props;

    const actionIcon = this.state.sending ? (
      <LoadingIcon size={32} />
    ) : (
      APPLY_ICON({ size: 32 })
    );

    return (
      <Overlay closeable onClose={onDismiss}>
        <div style={{ minWidth: "50vw" }} className={`br3`}>
          <div className="f3 flex items-center">
            {JOB_ICON({ size: 32 })} <Label>jobPost</Label>
          </div>
          <div>
            <Label>jobEmail</Label>: {job.email}
          </div>
          <div>
            <Label>jobNickname</Label>: {job.nickname}
          </div>
          <div className="mt3">
            <Label>jobDescription</Label>:
          </div>

          <div>{job.description}</div>

          <div className="mt3">
            <Label>yourEmail</Label>:
          </div>

          <Input
            onChange={email => {
              this.setState({
                email
              });
            }}
            value={this.state.email}
            className={`f4 w-100`}
          />
          <div className="mt3">
            <Label>yourMessage</Label>:
          </div>

          <Input
            onChange={message => {
              this.setState({
                message
              });
            }}
            value={this.state.message}
            autoFocus={false}
            tag="textarea"
            rows={5}
            className={`f4 w-100`}
          />

          <ActionButton
            disabled={this.isSendDisabled()}
            className={`mt3 flex items-center`}
            onClick={() => this.onSend()}
          >
            {actionIcon} <Label>SEND</Label>
          </ActionButton>
        </div>
      </Overlay>
    );
  }
}

export default ApplyOverlay;
