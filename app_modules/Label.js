import React from "react";
import { FormattedMessage } from "react-intl";

const Label = ({ children, values, defaultMessage, ...props }) => {
  const key = children;
  return (
    <FormattedMessage
      {...props}
      id={key}
      values={values}
      defaultMessage={defaultMessage || key}
    />
  );
};

export default Label;
