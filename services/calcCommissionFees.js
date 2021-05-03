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
  const cashInFee = cashIn.percents;
  const cashInMaxFee = cashIn.max.amount;
  const cashOutWeekFeeNatural = cashOutNatural.percents / 100;
  const cashOutWeekLimitNatural = cashOutNatural.week_limit.amount;
 


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

    // calcCashOutCommissionFeesNatural(
    //   parsedJSONdataWithFees,
    //   allUniqUserIds,
    //   cashOutWeekLimitNatural,
    //   cashOutWeekFeeNatural,
    //   getNumberOfWeek
    // );

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
      .filter((performedOperation) => performedOperation.type === "cash_in")
      .map((performedOperation) => {

        console.log('cur ID', `${performedOperation.user_id}, cash_in - ${performedOperation.operation.amount}`); // comment
        console.log('cur amount', `${performedOperation.operation.amount}`); // comment

        let calcCashInFee = performedOperation.operation.amount * (cashInFee / 100);

        if (calcCashInFee > cashInMaxFee) {
          console.log(calcCashInFee = cashInMaxFee);
        } else {
          console.log(calcCashInFee);
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

function calcCashOutCommissionFeesJuridical(params) {

}

export default calcCommissionFees;