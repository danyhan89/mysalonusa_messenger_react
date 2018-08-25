import { DateTime } from "luxon";
const timezoneOffset = new Date().getTimezoneOffset();
const getDayFormat = dateString => {
  const date = DateTime.fromISO(dateString).plus({ minutes: -timezoneOffset });

  return date.toLocaleString();
};

export default getDayFormat;
