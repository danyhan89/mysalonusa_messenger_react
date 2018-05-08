import React, { Component } from "react";
import isEmail from "is-email";
import Label from "@app/Label";
import join from "@app/join";
import ActionButton from "@app/ActionButton";
import LoadingIcon from "@app/LoadingIcon";
import ShadowBox from "src/components/ShadowBox";
import { createJob, editJob } from "src/api";

import communities, { getCommunity } from "src/communities";
import states from "src/states";
import styles from "./index.scss";

import OptionList from "../../OptionList";

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

const Button = ({
  disabled,
  tabIndex,
  className,
  children = "Next",
  onClick
}) => {
  return (
    <ActionButton
      tabIndex={tabIndex}
      disabled={disabled}
      className={className}
      onClick={onClick}
    >
      {children}
    </ActionButton>
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
      <Label>jobDescription</Label>: {state.description}
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
    key: "description",
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
    buttonLabel: ({ defaultValues }) =>
      defaultValues ? <Label>update</Label> : <Label>create</Label>,
    submit: true,
    render: renderPreview
  },
  {
    key: "waiting",
    locked: true,
    buttonLabel: (
      <span>
        <LoadingIcon /> <Label>creating</Label>
      </span>
    ),
    render: renderPreview
  },
  {
    key: "apply",
    render: renderPreview,
    onClick: ({ onApplyClick }) => onApplyClick(),
    buttonLabel: ({ defaultValues }) => <Label>apply</Label>
  }
];

class PostJobForm extends Component {
  constructor(props) {
    super(props);

    const { defaultValues, step } = props;

    let currentStep = defaultValues ? 2 : 0;

    if (step) {
      STEPS.forEach((s, index) => {
        if (s.key == step) {
          currentStep = index;
        }
      });
    }

    this.state = {
      uniqueNickname: global.localStorage.getItem("nickname"),
      currentStep,
      minStep: defaultValues ? 2 : 0,
      community: getCommunity(props.community).value,
      state: props.state,
      nickname: global.localStorage.getItem("alias") || "",
      email: defaultValues ? defaultValues.email : "",
      description: defaultValues ? defaultValues.description : ""
    };
    if (defaultValues) {
      this.state.id = defaultValues.id;
    }
  }

  prev() {
    let { currentStep } = this.state;

    currentStep--;

    this.setState({
      currentStep
    });
  }

  next() {
    let { currentStep } = this.state;
    const step = STEPS[currentStep];

    if (step.onClick) {
      step.onClick(this.props);
    }
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

    const apiMethod = this.props.defaultValues ? editJob : createJob;
    apiMethod(job).then(result => {
      if (result.success) {
        this.props.onSuccess(job);
      }
    });
  }

  render() {
    const { currentStep } = this.state;

    const step = STEPS[currentStep];
    const stepValue = this.state[step.key];
    const isValid = step.isValid || returnTrue;
    const hasPrev = !step.locked && currentStep > this.props.minStep;
    const valid = isValid(stepValue);

    const onChange = value => {
      this.setState({
        [step.key]: value
      });
    };

    const buttonLabel =
      typeof step.buttonLabel == "function"
        ? step.buttonLabel(this.props)
        : step.buttonLabel;

    return (
      <ShadowBox>
        <div className={join(styles.form)}>
          {this.props.children}
          {step.render({ value: stepValue, onChange, state: this.state })}
          <div className="mt3 mb3">
            {currentStep > 0 && hasPrev ? (
              <Button className={styles.prevButton} onClick={() => this.prev()}>
                <Label>prev</Label>
              </Button>
            ) : null}
            <Button disabled={!valid} onClick={() => this.next()}>
              {buttonLabel || <Label>next</Label>}
            </Button>
          </div>
        </div>
      </ShadowBox>
    );
  }
}

export default PostJobForm;
