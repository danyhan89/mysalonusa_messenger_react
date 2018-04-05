import { DateTime } from "luxon";

const timezoneOffset = new Date().getTimezoneOffset();

export const renderDate = dateString => {
  const date = DateTime.fromISO(dateString).plus({ minutes: -timezoneOffset });

  return date.toLocaleString(DateTime.DATETIME_SHORT);
};

export const renderHour = dateString => {
  const date = DateTime.fromISO(dateString).plus({ minutes: -timezoneOffset });

  return date.toLocaleString(DateTime.TIME_SIMPLE);
};
