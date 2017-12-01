import React from "react";
import PropTypes from "prop-types";

import { accentColor } from "@app/colors";

export const SIZE_MAP = {
  small: 12,
  standard: 14,
  std: 14, // an alias to standard
  "std-large": 16, // an alias to standard
  title: 20,
  headline: 28,
  "headline-large": 34,
  hero: 42
};

export const LINE_HEIGHT_MAP = {
  small: 1,
  standard: 1.4,
  std: 1.4, // an alias to standard
  "std-large": 1.6, // an alias to standard
  title: 2,
  headline: 2.8,
  "headline-large": 3.4,
  hero: 4.2
};

const WEIGHT_MAP = {
  thin: 100,
  light: 300,
  regular: 400,
  medium: 500,
  bold: 700,
  black: 900
};

export const TONE_COLOR_MAP = {
  neutral: "#4c4c4c",
  dark: "#323232",
  positive: accentColor,
  critical: accentColor,
  passive: "#9c9c9c",
  disabled: "#d0d0d0"
};

const Text = ({
  weight = "regular",
  size = "std",
  lineHeight,
  tone = "neutral",
  color,
  inlineBlock,
  block,
  children,
  ...props
}) => {
  const style = {
    ...props.style,
    fontSize: SIZE_MAP[size] || SIZE_MAP.std,
    lineHeight: LINE_HEIGHT_MAP[size] || LINE_HEIGHT_MAP.std
  };

  if (block) {
    style.display = "block";
  } else {
    style.display = "inline-block";
  }

  if (weight) {
    style.fontWeight = WEIGHT_MAP[weight];
  }
  if (lineHeight) {
    style.lineHeight = lineHeight;
  }

  if (tone) {
    style.color = TONE_COLOR_MAP[tone];
    style.fill = TONE_COLOR_MAP[tone];
  }

  if (color) {
    style.color = color;
    style.fill = color;
  }

  const Tag = props.tag || "span";
  return <Tag {...props} style={style} children={children} />;
};

Text.propTypes = {
  weight: PropTypes.oneOf([
    "thin",
    "light",
    "regular",
    "medium",
    "bold",
    "black"
  ]),
  size: PropTypes.oneOf([
    "small",
    "standard",
    "std",
    "std-large",
    "title",
    "headline",
    "headline-large",
    "hero"
  ]),
  tone: PropTypes.oneOf([
    "neutral",
    "dark",
    "positive",
    "critical",
    "passive",
    "disabled"
  ]),
  inlineBlock: PropTypes.bool,
  block: PropTypes.bool,
  tag: PropTypes.string,
  color: PropTypes.string
};

export default Text;
