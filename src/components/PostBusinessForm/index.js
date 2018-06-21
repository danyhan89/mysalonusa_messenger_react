/*
create_table "business_on_sales", force: :cascade do |t|
    t.integer  "company_location_sale_id"
    t.text     "title"
    t.text     "description"
    t.integer  "views",                    default: 0
    t.text     "contact_email"
    t.datetime "created_at",                               null: false
    t.datetime "updated_at",                               null: false
    t.integer  "price_cents",              default: 0,     null: false
    t.string   "price_currency",           default: "USD", null: false
    t.json     "images"
    t.string   "price_string"
    t.string   "image_urls",               default: [],                 array: true
    t.integer  "city_id"
  end
  */
import React, { Component, cloneElement } from "react";

import isEmail from "is-email";
import Label from "@app/Label";
import join from "@app/join";
import ActionButton from "@app/ActionButton";
import LoadingIcon from "@app/LoadingIcon";
import { createBusiness, editBusiness } from "src/api";
import { deleteIcon } from "src/components/icons";

import communities, { getCommunity } from "src/communities";
import states from "src/states";
import styles from "./index.scss";

import OptionList from "../OptionList";

import CitySelect from "./CitySelect";
import ShadowBox from "../ShadowBox";

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
    <div className={styles.label} key="community">
      <Label>community</Label>: {state.community}
    </div>,
    <div className={styles.label} key="state">
      <Label>state</Label>: {state.state}
    </div>,
    <div className={styles.label} key="city">
      <Label>city</Label>: {state.city ? state.city.name : null}
    </div>,
    <div className={styles.label} key="nickname">
      <Label>nickname</Label>: {state.nickname}
    </div>,
    <div className={styles.label} key="email">
      <Label>email</Label>: {state.email}
    </div>,
    <div className={styles.label} key="businessTitle">
      <Label>businessTitle</Label>: {state.title}
    </div>,

    <div className={styles.label} key="businessDescription">
      <Label>businessDescription</Label>: {state.description}
    </div>,
    <div className={styles.label} key="businessImageLabel">
      <Label>businessImage</Label>:
    </div>,
    <div
      className={styles.imageContainer + " " + styles.label}
      key="businessImage"
    >
      {state.image_urls
        ? state.image_urls.map(url => {
            return <img key={url} src={url} />;
          })
        : null}
      {state.images.map(({ file, data }) => {
        return <img key={file.name} src={data} />;
      })}
    </div>
  ];
};

const EDIT_VIEWS = {
  key: "views",
  canSkip: true,

  render: ({ onChange, value }) => {
    return [
      <div key="label" className={styles.label} style={{ paddingBottom: 20 }}>
        <Label>views</Label>
      </div>,
      <input
        key="input"
        type="text"
        value={value}
        autoFocus
        placeholder="Number of views"
        className={styles.input + " " + styles.field}
        onChange={event => {
          event.stopPropagation();
          onChange(event.target.value);
        }}
      />
    ];
  }
};

const STEPS = [
  {
    key: "state",
    render: ({ onChange, value }) => {
      return [
        <Label key="label" className={styles.label}>
          whichStatePostJob
        </Label>,
        <OptionList
          key="optionList"
          className={styles.field}
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
    key: "city",
    isValid: city => city && city.id != null,
    render: ({ onChange, value, state }) => {
      return [
        <Label key="label" className={styles.label}>
          whichStatePostJob
        </Label>,
        <CitySelect
          className={styles.field}
          state={state.state}
          onChange={onChange}
        />
      ];
    }
  },
  {
    key: "nickname",
    canSkip: true,
    isValid: nickname => !!nickname,
    render: ({ onChange, value }) => {
      return [
        <div key="label" className={styles.label} style={{ paddingBottom: 20 }}>
          <Label>userNameForPosting</Label>
        </div>,
        <input
          key="input"
          type="text"
          value={value}
          autoFocus
          placeholder="Your nickname"
          className={styles.input + " " + styles.field}
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
        <div key="label" className={styles.label} style={{ paddingBottom: 20 }}>
          <Label>emailForPosting</Label>
        </div>,
        <input
          key="input"
          type="email"
          autoFocus
          placeholder="Your email address"
          value={value}
          className={styles.input + " " + styles.field}
          onChange={event => {
            event.stopPropagation();
            onChange(event.target.value);
          }}
        />
      ];
    }
  },
  {
    key: "title",
    isValid: value => !!value,
    render: ({ onChange, value }) => {
      return [
        <div key="label" className={styles.label} style={{ paddingBottom: 20 }}>
          <Label>businessTitle</Label>
        </div>,
        <input
          key="title"
          autoFocus
          placeholder="Your short business title"
          value={value}
          className={styles.input + " " + styles.field}
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
        <div key="label" className={styles.label} style={{ paddingBottom: 20 }}>
          <Label>businessDescription</Label>
        </div>,
        <textarea
          key="description"
          autoFocus
          placeholder="Your business description"
          value={value}
          rows={7}
          className={styles.textarea + " " + styles.field}
          onChange={event => {
            event.stopPropagation();
            onChange(event.target.value);
          }}
        />
      ];
    }
  },
  {
    key: "price",
    isValid: value => parseFloat(value) == value,
    canSkip: true,
    render: ({ onChange, value }) => {
      return [
        <div key="label" className={styles.label} style={{ paddingBottom: 20 }}>
          <Label>businessPrice</Label>
        </div>,
        <input
          key="price"
          autoFocus
          type="number"
          placeholder="Your business price"
          value={value}
          className={styles.input + " " + styles.field}
          onChange={event => {
            event.stopPropagation();
            onChange(event.target.value);
          }}
        />
      ];
    }
  },
  {
    key: "images",
    isValid: (images, state) =>
      (images && images.length > 0) ||
      (state.image_urls && state.image_urls.length > 0),
    render: ({ onChange, state, setState }) => {
      return [
        <div key="label" className={styles.label} style={{ paddingBottom: 20 }}>
          <Label>businessImage</Label>
        </div>,
        <input
          key="price"
          autoFocus
          type="file"
          accept="image/*"
          placeholder="Your business picture"
          className={styles.input + " " + styles.field}
          multiple
          onChange={event => {
            event.stopPropagation();
            const files = [...event.target.files];

            const promises = files.map(file => {
              return new Promise((resolve, reject) => {
                const reader = new FileReader();
                reader.addEventListener(
                  "load",
                  () => {
                    resolve({
                      file,
                      data: reader.result
                    });
                  },
                  false
                );

                if (file) {
                  reader.readAsDataURL(file);
                }
              });
            });

            Promise.all(promises).then(files => onChange(files));
          }}
        />,
        <div
          className={styles.imageContainer + " " + styles.label}
          key="businessImage"
        >
          {state.image_urls
            ? state.image_urls.map(url => {
                return (
                  <div style={{ position: "relative", width: "100%" }}>
                    <img key={url} src={url} style={{ minHeight: 100 }} />
                    <div
                      onClick={() => {
                        const image_urls = state.image_urls.filter(
                          u => u && u != url
                        );

                        setState({ image_urls });
                      }}
                      style={{
                        right: 20,
                        top: 20,
                        position: "absolute",
                        fill: "white",
                        cursor: "pointer"
                      }}
                    >
                      {deleteIcon}
                    </div>
                  </div>
                );
              })
            : null}
        </div>
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

class PostBusinessForm extends Component {
  constructor(props) {
    super(props);

    const { defaultValues, step, admin } = props;
    let THIS_STEPS = [...STEPS];

    if (admin) {
      THIS_STEPS = [
        ...THIS_STEPS.slice(0, 2),
        EDIT_VIEWS,
        ...THIS_STEPS.slice(2)
      ];
    }

    let currentStep = defaultValues ? 2 : 0;

    if (step) {
      THIS_STEPS.forEach((s, index) => {
        if (s.key == step) {
          currentStep = index;
        }
      });
    }
    const alias = global.localStorage.getItem("alias") || "";

    this.state = {
      STEPS: THIS_STEPS,
      uniqueNickname: global.localStorage.getItem("nickname"),
      currentStep,
      images: [],
      image_urls: defaultValues ? defaultValues.image_urls : null,
      minStep: defaultValues ? 2 : 0,
      community: getCommunity(props.community).value,
      state: defaultValues ? defaultValues.state || props.state : props.state,
      city: defaultValues ? defaultValues.city : null,
      views: defaultValues ? defaultValues.views || 0 : 0,
      title: defaultValues ? defaultValues.title : "",
      nickname: alias,
      email: defaultValues ? defaultValues.email : "",
      price: defaultValues ? defaultValues.price : "",
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
    const { STEPS } = this.state;
    const step = STEPS[currentStep];

    if (step.onClick) {
      step.onClick(this.props);
    }
    if (step && step.locked) {
      return;
    }

    currentStep++;
    if (step.submit) {
      this.postBusiness();
    }
    if (STEPS[currentStep]) {
      this.setState({
        currentStep
      });
    }
  }
  postBusiness() {
    const { currentStep, ...business } = this.state;

    const apiMethod = this.props.defaultValues ? editBusiness : createBusiness;

    const formData = new FormData();

    if (this.props.defaultValues) {
      formData.append("image_urls", this.state.image_urls);
    }

    Object.keys(business).forEach(key => {
      let value = business[key];
      if (key == "city") {
        value = value.id;
      }
      if (key == "images") {
        value.forEach(({ file, data }, index) => {
          formData.append(`images[${index}]`, data);
          formData.append(`fileNames[${index}]`, file.name);
          formData.append(`contentTypes[${index}]`, file.type);
        });
      } else {
        formData.append(key, value);
      }
    });

    apiMethod(formData).then(result => {
      if (result.success) {
        this.props.onSuccess(business);
      }
    });
  }

  render() {
    const { currentStep, STEPS } = this.state;

    const step = STEPS[currentStep];
    const stepValue = this.state[step.key];
    const isValid = step.isValid || returnTrue;
    const hasPrev = !step.locked && currentStep > this.props.minStep;
    const valid = isValid(stepValue, this.state);

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
      <div className={join(styles.form)}>
        <ShadowBox>
          {this.props.children}
          {step.render({
            value: stepValue,
            onChange,
            state: this.state,
            setState: (...args) => {
              this.setState(...args);
            }
          })}
          <div className="mt3 mb3">
            {currentStep > 0 && hasPrev ? (
              <Button className={styles.prevButton} onClick={() => this.prev()}>
                <Label>prev</Label>
              </Button>
            ) : null}
            <Button disabled={!valid} onClick={() => this.next()}>
              {buttonLabel || <Label>next</Label>}
            </Button>
            {step.canSkip ? (
              <Button className="ml3" onClick={() => this.next()}>
                <Label>skip</Label>
              </Button>
            ) : null}
          </div>
        </ShadowBox>
      </div>
    );
  }
}

export default PostBusinessForm;
