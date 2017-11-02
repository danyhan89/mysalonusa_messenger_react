import React from "react";
import { FormattedMessage } from "react-intl";

const Label = ({ children, values, defaultMessage }) => {
  const key = children;
  return (
    <FormattedMessage
      id={key}
      values={values}
      defaultMessage={defaultMessage || key}
    />
  );
};

export default Label;
