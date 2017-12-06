import React, { Component } from "react";
import isEmail from "is-email";
import Label from "@app/Label";
import join from "@app/join";

import { createJob } from "src/api";

import communities, { getCommunity } from "src/communities";
import states from "src/states";
import styles from "./index.scss";

import OptionList from "../OptionList";
import LoadingIcon from "./LoadingIcon";

const preventDefault = e => e.preventDefault();

class Question extends Component {
  constructor(props) {
    super(props);
    this.state = {
      expanded: false
    };

    this.changeAnswer = this.changeAnswer.bind(this);
  }
  changeAnswer(e) {
    preventDefault(e);
    this.setState({ expanded: true });
  }
  render() {
    const { label, answer, options } = this.props;
    return (
      <div>
        <div>
          <Label>{label}</Label>
        </div>

        <OptionList defaultValue={answer.value} options={options} />
      </div>
    );
  }
}

const Button = ({ disabled, children = "Next", onClick }) => {
  return (
    <button
      disabled={disabled}
      className={join(styles.actionButton, disabled && styles.disabled)}
      onClick={onClick}
    >
      {children}
    </button>
  );
};

// community -> state -> nickname -> email
// -> job description -> CONFIRM - > show feedback

const returnTrue = () => true;

const renderPreview = ({ state }) => {
  return [
    <div key="community">
      <Label>community</Label>: {state.community}
    </div>,
    <div key="state">
      <Label>state</Label>: {state.state}
    </div>,
    <div key="nickname">
      <Label>nickname</Label>: {state.nickname}
    </div>,
    <div key="email">
      <Label>email</Label>: {state.email}
    </div>,
    <div key="jobDescription">
      <Label>jobDescription</Label>: {state.jobDescription}
    </div>
  ];
};

const STEPS = [
  {
    key: "community",
    render: ({ onChange, value }) => {
      return [
        <Label key="label">whichCommunityPostJob</Label>,
        <OptionList
          key="optionList"
          value={value}
          options={communities}
          onChange={onChange}
        />
      ];
    }
  },
  {
    key: "state",
    render: ({ onChange, value }) => {
      return [
        <Label key="label">whichStatePostJob</Label>,
        <OptionList
          key="optionList"
          value={value}
          options={states.map(state => ({
            value: state.toLowerCase(),
            name: state
          }))}
          onChange={onChange}
        />
      ];
    }
  },
  {
    key: "nickname",
    isValid: nickname => !!nickname,
    render: ({ onChange, value }) => {
      return [
        <div key="label" style={{ paddingBottom: 20 }}>
          <Label>userNameForPosting</Label>
        </div>,
        <input
          key="input"
          type="text"
          value={value}
          autoFocus
          placeholder="Your nickname"
          className={styles.input}
          onChange={event => {
            event.stopPropagation();
            onChange(event.target.value);
          }}
        />
      ];
    }
  },
  {
    key: "email",
    isValid: isEmail,
    render: ({ onChange, value }) => {
      return [
        <div key="label" style={{ paddingBottom: 20 }}>
          <Label>emailForPosting</Label>
        </div>,
        <input
          key="input"
          type="email"
          autoFocus
          placeholder="Your email address"
          value={value}
          className={styles.input}
          onChange={event => {
            event.stopPropagation();
            onChange(event.target.value);
          }}
        />
      ];
    }
  },
  {
    key: "jobDescription",
    isValid: value => !!value,
    render: ({ onChange, value }) => {
      return [
        <div key="label" style={{ paddingBottom: 20 }}>
          <Label>jobDescription</Label>
        </div>,
        <textarea
          key="description"
          autoFocus
          placeholder="Your job description"
          value={value}
          rows={7}
          className={styles.textarea}
          onChange={event => {
            event.stopPropagation();
            onChange(event.target.value);
          }}
        />
      ];
    }
  },
  {
    key: "preview",
    buttonLabel: "Create",
    submit: true,
    render: renderPreview
  },
  {
    key: "waiting",
    locked: true,
    buttonLabel: (
      <span>
        <LoadingIcon /> Creating
      </span>
    ),
    render: renderPreview
  }
];

class PostJobForm extends Component {
  constructor(props) {
    super(props);

    this.state = {
      currentStep: 6,
      community: getCommunity(props.community).value,
      state: props.state,
      nickname: "",
      email: "",
      jobDescription: ""
    };
  }

  next() {
    let { currentStep } = this.state;
    const step = STEPS[currentStep];

    if (step && step.locked) {
      return;
    }
    currentStep++;
    if (step.submit) {
      this.postJob();
    }
    if (STEPS[currentStep]) {
      this.setState({
        currentStep
      });
    }
  }
  postJob() {
    const { currentStep, ...job } = this.state;
    createJob(job).then(() => {
      console.log("success");
    });
  }

  render() {
    const step = STEPS[this.state.currentStep];
    const stepValue = this.state[step.key];
    const isValid = step.isValid || returnTrue;
    const valid = isValid(stepValue);

    const onChange = value => {
      this.setState({
        [step.key]: value
      });
    };

    return (
      <div className={join(styles.form)}>
        {step.render({ value: stepValue, onChange, state: this.state })}
        <Button disabled={!valid} onClick={() => this.next()}>
          {step.buttonLabel || "Next"}
        </Button>
      </div>
    );
  }
}

export default PostJobForm;
