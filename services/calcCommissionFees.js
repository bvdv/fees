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
  cashOutNatural,
  cashOutJuridical
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

      parsedJSONdataWithFees
        .filter((performedOperation) => performedOperation.user_id === uniqUserID)
        .filter((performedOperation) => (
          performedOperation.user_type === "natural" && performedOperation.type === "cash_out")
        )
        .reduce((prevPerformedOperation, performedOperation) => {
          if (performedOperation) {
            const cashOutWeekLimitNatural = cashOutNatural.week_limit.amount;
            const cashOutWeekFeeNatural = cashOutNatural.percents / 100;
            const currentWeek = getNumberOfWeek(performedOperation.date);
            const prevWeek = getNumberOfWeek(prevPerformedOperation.date);

            userTotalCashOut += performedOperation.operation.amount;

            if (
              userTotalCashOut > cashOutWeekLimitNatural
              && currentWeek === prevWeek
              && !firstWeekLimitExcess
            ) {
              // calculate fee for first occurrence of cash out week limit excess
              firstWeekLimitExcess = true;
              performedOperation.operation.commission_fee = (performedOperation.operation.amount - (cashOutWeekLimitNatural - prevPerformedOperation.operation.amount)) * cashOutWeekFeeNatural;

            } else if (
              userTotalCashOut > cashOutWeekLimitNatural
              && !prevPerformedOperation.date
              && !firstWeekLimitExcess
            ) {
              // calculate fee if first operation of week exceeded cash out week limit
              firstWeekLimitExcess = true;
              performedOperation.operation.commission_fee = (performedOperation.operation.amount - cashOutWeekLimitNatural) * cashOutWeekFeeNatural;

            } else if (userTotalCashOut > cashOutWeekLimitNatural && currentWeek === prevWeek) {
              // calculate fee if cash out week limit exceeded
              performedOperation.operation.commission_fee = performedOperation.operation.amount * cashOutWeekFeeNatural;
            }
          }

          return performedOperation;
        }, 0);
    });
    console.log(parsedJSONdataWithFees);
  }

  return false;
};

export default calcCommissionFees;