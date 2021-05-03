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
  const cashInFee = cashIn.percents / 100;
  const cashInMaxFee = cashIn.max.amount;
  const cashOutWeekFeeNatural = cashOutNatural.percents / 100;
  const cashOutWeekLimitNatural = cashOutNatural.week_limit.amount;
  const cashOutFeeJuridical = cashOutJuridical.percents / 100;
  const cashOutFeeMinJuridical = cashOutJuridical.min.amount;

  if (parsedJSONdata) {

    const parsedJSONdataWithFees = [...parsedJSONdata];

    // get array of all unique user_id from JSON file
    const allUniqUserIds = [
      ...new Set(parsedJSONdataWithFees.map(({ user_id }) => user_id)),
    ];

    calcCashInCommissionFees(
      parsedJSONdataWithFees,
      allUniqUserIds,
      cashInFee,
      cashInMaxFee
    );

    calcCashOutCommissionFeesNatural(
      parsedJSONdataWithFees,
      allUniqUserIds,
      cashOutWeekLimitNatural,
      cashOutWeekFeeNatural,
      getNumberOfWeek
    );

    calcCashOutCommissionFeesJuridical(
      parsedJSONdataWithFees,
      allUniqUserIds,
      cashOutFeeJuridical,
      cashOutFeeMinJuridical
    );

    console.log(parsedJSONdataWithFees);
  }

  return false;
};

function calcCashInCommissionFees(
  parsedJSONdataWithFees,
  allUniqUserIds,
  cashInFee,
  cashInMaxFee
) {

  allUniqUserIds.forEach((uniqUserID) => {

    parsedJSONdataWithFees
      .filter((performedOperation) => performedOperation.user_id === uniqUserID)
      .filter((performedOperation) => (
        performedOperation.type === "cash_in"))
      .map((performedOperation) => {

        const calcCashInFee = performedOperation.operation.amount * cashInFee;

        if (calcCashInFee >= cashInMaxFee) {
          performedOperation.operation.commission_fee = cashInMaxFee;
        } else {
          performedOperation.operation.commission_fee = calcCashInFee;
        }
      });
  });
}

function calcCashOutCommissionFeesNatural(
  parsedJSONdataWithFees,
  allUniqUserIds,
  cashOutWeekLimitNatural,
  cashOutWeekFeeNatural,
  getNumberOfWeek
) {

  allUniqUserIds.forEach((uniqUserID) => {

    let userTotalCashOut = 0;
    let firstWeekLimitExcess;

    parsedJSONdataWithFees
      .filter((performedOperation) => performedOperation.user_id === uniqUserID)
      .filter((performedOperation) => (
        performedOperation.user_type === "natural" && performedOperation.type === "cash_out")
      )
      .reduce((prevPerformedOperation, performedOperation) => {

        userTotalCashOut += performedOperation.operation.amount;

        if (performedOperation && userTotalCashOut > cashOutWeekLimitNatural) {

          const currentWeek = getNumberOfWeek(performedOperation.date);
          const prevWeek = getNumberOfWeek(prevPerformedOperation.date);

          if (currentWeek === prevWeek && !firstWeekLimitExcess) {
            // calculate fee for first occurrence of cash out week limit excess
            firstWeekLimitExcess = true;
            performedOperation.operation.commission_fee = (performedOperation.operation.amount - (cashOutWeekLimitNatural - prevPerformedOperation.operation.amount)) * cashOutWeekFeeNatural;

          } else if (!prevPerformedOperation.date && !firstWeekLimitExcess) {
            // calculate fee if first operation of week exceeded cash out week limit
            firstWeekLimitExcess = true;
            performedOperation.operation.commission_fee = (performedOperation.operation.amount - cashOutWeekLimitNatural) * cashOutWeekFeeNatural;

          } else if (currentWeek === prevWeek) {
            // calculate fee if cash out week limit exceeded
            performedOperation.operation.commission_fee = performedOperation.operation.amount * cashOutWeekFeeNatural;
          }
        }

        return performedOperation;
      }, 0);
  });
}

function calcCashOutCommissionFeesJuridical(
  parsedJSONdataWithFees,
  allUniqUserIds,
  cashOutFeeJuridical,
  cashOutFeeMinJuridical
) {

  allUniqUserIds.forEach((uniqUserID) => {

    parsedJSONdataWithFees
      .filter((performedOperation) => performedOperation.user_id === uniqUserID)
      .filter((performedOperation) => (
        performedOperation.user_type === "juridical" && performedOperation.type === "cash_out")
      )
      .map((performedOperation) => {

        const calcCashOutFeeJuridical = performedOperation.operation.amount * cashOutFeeJuridical;

        if (calcCashOutFeeJuridical >= cashOutFeeMinJuridical) {
          performedOperation.operation.commission_fee = cashOutFeeMinJuridical;
        } else {
          performedOperation.operation.commission_fee = calcCashOutFeeJuridical;
        }
      });
  });
}

export default calcCommissionFees;