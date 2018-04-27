import React from "react";
import PropTypes from "prop-types";

import JOB_ICON from "src/components/ChatroomContent/jobIcon";
import APPLY_ICON from "src/components/ApplyButton/applyIcon";
import PostJobForm from "src/components/PostAJob/PostJobForm";

import isEmail from "is-email";

import Overlay from "@app/Overlay";
import Label from "@app/Label";
import join from "@app/join";
import Input from "@app/Input";
import ActionButton from "@app/ActionButton";
import LoadingIcon from "@app/LoadingIcon";

import { applyForJob, incrementJobView } from "src/api";

class ViewAndApply extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      step: props.defaultStep || "view",
      message: "",
      email: ""
    };
  }

  render() {
    const { job, lang, state, community } = this.props;

    return (
      <Overlay
        closeable
        onClose={() => {
          this.props.onDismiss(false);
        }}
      >
        {this.state.step == "view"
          ? this.renderViewStep()
          : this.renderApplyStep()}
      </Overlay>
    );
  }

  renderViewStep() {
    const { job, lang, state, community } = this.props;
    return (
      <PostJobForm
        step="apply"
        defaultValues={job}
        onApplyClick={() => {
          this.setState({
            step: "apply"
          });
        }}
        lang={lang}
        state={state}
        community={community}
      />
    );
  }

  renderApplyStep() {
    const { job, lang, state, community } = this.props;
    const actionIcon = this.state.sending ? (
      <LoadingIcon size={32} />
    ) : (
      APPLY_ICON({ size: 32 })
    );

    const otherChildren = [
      <div key="label">
        <Label>yourEmail</Label>:
      </div>,

      <Input
        key="emailField"
        type="email"
        onChange={email => {
          this.setState({
            email
          });
        }}
        value={this.state.email}
        className={`f4 w-100`}
      />,
      <div className="mt3" key="message">
        <Label>yourMessage</Label>:
      </div>,

      <Input
        key="messageField"
        onChange={message => {
          this.setState({
            message
          });
        }}
        value={this.state.message}
        autoFocus={false}
        tag="textarea"
        placeholder="Message here - longer than 20 characters"
        rows={5}
        className={`f4 w-100`}
      />,

      <ActionButton
        key="actionButton"
        disabled={this.isSendDisabled()}
        className={`mt3 flex items-center mb3`}
        onClick={() => this.onSend()}
      >
        {actionIcon} <Label>SEND</Label>
      </ActionButton>
    ];

    return (
      <div
        style={{ minWidth: "50vw", maxHeight: "90vh" }}
        className={`mw7 br3`}
      >
        <div className="f3 flex items-center mt3">
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

        <div className="mb3">{job.description}</div>

        {otherChildren}
      </div>
    );
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

        this.props.onDismiss(true);
      })
      .catch(() => {
        this.setState({
          sending: false
        });
      });
  }
}

ViewAndApply.propTypes = {
  onDismiss: PropTypes.func.isRequired,
  job: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
  }).isRequired,
  lang: PropTypes.string.isRequired,
  state: PropTypes.string.isRequired,
  community: PropTypes.string.isRequired
};

export default ViewAndApply;
