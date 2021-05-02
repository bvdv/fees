"use strict";
/**
 * Returns the ISO week of the date.
 * code from https://weeknumber.com/how-to/javascript
 */

// TODO: add errors handling
const getNumberOfWeek = (dateOfOperation) => {
  let date = new Date(dateOfOperation);
  date.setHours(0, 0, 0, 0);
  // Thursday in current week decides the year.
  date.setDate(date.getDate() + 3 - (date.getDay() + 6) % 7);
  // January 4 is always in week 1.
  let week1 = new Date(date.getFullYear(), 0, 4);
  // Adjust to Thursday in week 1 and count number of weeks from date to week1.
  return 1 + Math.round(((date.getTime() - week1.getTime()) / 86400000 - 3 + (week1.getDay() + 6) % 7) / 7);
}

export default getNumberOfWeek;