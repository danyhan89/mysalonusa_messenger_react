import React, { Component } from "react";
import PropTypes from "prop-types";

import join from "@app/join";

import styles from "./index.scss";

const ICON_SIZE = 22;
const checkedIcon = (
  <svg
    className={join(styles.checkedIcon, styles.icon)}
    height={ICON_SIZE}
    viewBox="0 0 24 24"
    width={ICON_SIZE}
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M12 7c-2.76 0-5 2.24-5 5s2.24 5 5 5 5-2.24 5-5-2.24-5-5-5zm0-5C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8z" />
  </svg>
);

const uncheckedIcon = (
  <svg
    className={join(styles.uncheckedIcon, styles.icon)}
    height={ICON_SIZE}
    viewBox="0 0 24 24"
    width={ICON_SIZE}
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8z" />
  </svg>
);

class OptionList extends Component {
  constructor(props) {
    super(props);

    this.state = {
      value: props.defaultValue
    };

    this.renderOption = this.renderOption.bind(this);
    this.onKeyDown = this.onKeyDown.bind(this);
  }
  onKeyDown(event) {
    const { key } = event;
    let dir;

    if (key == "ArrowUp" || key == "ArrowLeft") {
      dir = -1;
    }
    if (key == "ArrowDown" || key == "ArrowRight") {
      dir = 1;
    }
    if (dir) {
      this.setIndex(this.getIndex() + dir);
    }
  }
  setIndex(index) {
    const { options } = this.props;
    if (index < 0) {
      index = options.length - 1;
    }
    if (index >= options.length) {
      index = 0;
    }
    this.onChange(options[index]);
  }

  getIndex() {
    const { options } = this.props;
    const value = this.getValue();

    return options.reduce((acc, option, index) => {
      if (option.value === value) {
        return index;
      }
      return acc;
    }, -1);
  }
  onChange(option, event) {
    if (this.props.value == null) {
      // uncontrolled list
      this.setState({
        value: option.value
      });
    }

    if (this.props.onChange) {
      this.props.onChange(option.value, option, event);
    }
  }

  getValue() {
    return this.props.value == null ? this.state.value : this.props.value;
  }

  render() {
    const { options } = this.props;
    const style = { ...this.props.style };
    if (this.props.inlineBlock) {
      style.display = "inline-block";
    }
    return (
      <ul
        style={style}
        className={styles.list}
        tabIndex={0}
        onKeyDown={this.onKeyDown}
      >
        {options.map(this.renderOption)}
      </ul>
    );
  }

  renderOption(option) {
    const { value, name, label } = option;

    const selected = value === this.getValue();
    const icon = selected ? checkedIcon : uncheckedIcon;

    return (
      <li
        key={value}
        className={join(styles.option, selected && styles.selectedOption)}
        onClick={event => {
          this.onChange(option, event);
        }}
      >
        {icon}
        {name || label}
      </li>
    );
  }
}

OptionList.propTypes = {
  options: PropTypes.arrayOf(
    PropTypes.shape({
      value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      name: PropTypes.node
    })
  ).isRequired
};
OptionList.defaultProps = {
  inlineBlock: true
};
export default OptionList;
