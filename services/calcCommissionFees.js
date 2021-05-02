"use strict";
/**
 * TODO: make calcCommissionFees function with 
 * for loop and if..elseif for performance benchmark against forEach, filter, reduce and etc.
 */
const calcCommissionFees = (
  readInputFile,
  parseJSON,
  getNumberOfWeek,
  cashIn,
  cashOutJuridical,
  cashOutNatural,
) => {
  const readFile = readInputFile();
  const parsedJSONdata = parseJSON(readFile);

  if (parsedJSONdata) {

    const parsedJSONdataWithFees = [...parsedJSONdata];

    // get array of all unique user_id from JSON file
    let allUniqUserIds = [
      ...new Set(parsedJSONdataWithFees.map(({ user_id }) => user_id)),
    ];

    allUniqUserIds.forEach((uniqUserID) => {

      let userTotalCashOut = 0;
      let firstWeekLimitExcess;

      const result = parsedJSONdataWithFees
        .filter((obj) => obj.user_id === uniqUserID)
        .filter((obj) => obj.user_type === "natural" && obj.type === "cash_out")
        .reduce((prevObj, obj) => {
          if (obj) {
            const cashOutWeekLimit = cashOutNatural.week_limit.amount;
            let currentWeek = getNumberOfWeek(obj.date);
            let prevWeek = getNumberOfWeek(prevObj.date);

            userTotalCashOut += obj.operation.amount;

            if (
              userTotalCashOut > cashOutWeekLimit
              && currentWeek === prevWeek
              && !firstWeekLimitExcess
            ) {
              // calculate fee for first occurrence of cash out week limit excess
              firstWeekLimitExcess = true;
              obj.operation.commission_fee = (obj.operation.amount - (cashOutWeekLimit - prevObj.operation.amount)) * (cashOutNatural.percents / 100);

            } else if (
              userTotalCashOut > cashOutWeekLimit
              && !prevObj.date
              && !firstWeekLimitExcess
            ) {
              // calculate fee if first operation of week exceeded cash out week limit
              firstWeekLimitExcess = true;
              obj.operation.commission_fee = (obj.operation.amount - cashOutWeekLimit) * (cashOutNatural.percents / 100);

            } else if (userTotalCashOut > cashOutWeekLimit && currentWeek === prevWeek) {
              // calculate fee if cash out week limit exceeded
              obj.operation.commission_fee = obj.operation.amount * (cashOutNatural.percents / 100);
            }
          }
          console.log('d', parsedJSONdataWithFees);
          return obj;
        }, 0);
    });

    return false;
  }
};

export default calcCommissionFees;