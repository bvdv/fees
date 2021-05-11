import readInputFile from '../utils/readInputFile.js';
import parseJSON from '../utils/parseJSON.js';
import getNumberOfWeek from '../utils/getNumberOfWeek.js';
import getFeesConfig from '../utils/getFeesConfig.js';
import roundToSmallestCurrencyItem from '../utils/roundToSmallestCurrencyItem.js';
/**
 * TODO: make calcCommissionFees function with
 * for loop and if..elseif for performance benchmark against forEach, filter, reduce and etc.
 */
const calcCommissionFees = async () => {
  const readFile = readInputFile();
  const parsedJSONdata = parseJSON(readFile);

  if (parsedJSONdata) {
    const parsedJSONdataWithFees = [...parsedJSONdata];

    // get array of all unique user_id from JSON file
    const allUniqUserIds = [
      ...new Set(parsedJSONdataWithFees.map(({ user_id }) => user_id)),
    ];

    await calcCashInCommissionFees(
      parsedJSONdataWithFees,
      allUniqUserIds,
    );

    await calcCashOutCommissionFeesNatural(
      parsedJSONdataWithFees,
      allUniqUserIds,
    );

    await calcCashOutCommissionFeesJuridical(
      parsedJSONdataWithFees,
      allUniqUserIds,
    );

    stdoutResult(parsedJSONdataWithFees);
  }

  return false;
};

async function calcCashInCommissionFees(
  parsedJSONdataWithFees,
  allUniqUserIds,
) {
  const feesConfig = await getFeesConfig('http://vps785969.ovh.net/cash-in');
  const cashInFee = feesConfig.percents / 100;
  const cashInMaxFee = feesConfig.max.amount;

  allUniqUserIds.forEach((uniqUserID) => {
    const userOperations = parsedJSONdataWithFees.filter(
      (performedOperation) => performedOperation.user_id === uniqUserID,
    );

    const cashInUserOperations = userOperations.filter((performedOperation) => (performedOperation.type === 'cash_in'));

    cashInUserOperations.forEach((performedOperation) => {
      const calcCashInFee = performedOperation.operation.amount * cashInFee;

      if (calcCashInFee >= cashInMaxFee) {
        performedOperation.operation.commission_fee = cashInMaxFee;
      } else {
        const fee = roundToSmallestCurrencyItem(calcCashInFee);
        performedOperation.operation.commission_fee = fee;
      }
    });
  });

  return parsedJSONdataWithFees;
}

async function calcCashOutCommissionFeesNatural(
  parsedJSONdataWithFees,
  allUniqUserIds,
) {
  const feesConfig = await getFeesConfig('http://vps785969.ovh.net/cash-out-natural');
  const cashOutWeekFeeNatural = feesConfig.percents / 100;
  const cashOutWeekLimitNatural = feesConfig.week_limit.amount;

  allUniqUserIds.forEach((uniqUserID) => {
    let userWeekTotalCashOut = 0;
    let firstWeekLimitExcess;

    const userOperations = parsedJSONdataWithFees.filter(
      (performedOperation) => performedOperation.user_id === uniqUserID,
    );

    const cashCashOutOperations = userOperations.filter(
      (performedOperation) => (performedOperation.user_type === 'natural' && performedOperation.type === 'cash_out'),
    );

    cashCashOutOperations.reduce((prevPerformedOperation, performedOperation) => {
      userWeekTotalCashOut += performedOperation.operation.amount;

      if (performedOperation && userWeekTotalCashOut > cashOutWeekLimitNatural) {
        const currentWeek = getNumberOfWeek(performedOperation.date);
        const prevWeek = getNumberOfWeek(prevPerformedOperation.date);

        if (currentWeek === prevWeek && !firstWeekLimitExcess) {
          // calculate fee for first occurrence of cash out week limit excess
          firstWeekLimitExcess = true;
          const fee = (userWeekTotalCashOut - cashOutWeekLimitNatural) * cashOutWeekFeeNatural;
          performedOperation.operation.commission_fee = roundToSmallestCurrencyItem(fee);
        } else if (!prevPerformedOperation.date && !firstWeekLimitExcess) {
          // calculate fee if first operation of week exceeded cash out week limit
          firstWeekLimitExcess = true;
          const fee = (performedOperation.operation.amount - cashOutWeekLimitNatural)
          * cashOutWeekFeeNatural;
          performedOperation.operation.commission_fee = roundToSmallestCurrencyItem(fee);
        } else if (currentWeek === prevWeek) {
          // calculate fee if cash out week limit exceeded
          const fee = performedOperation.operation.amount * cashOutWeekFeeNatural;
          performedOperation.operation.commission_fee = roundToSmallestCurrencyItem(fee);
        } else {
          userWeekTotalCashOut = 0;
        }
      }

      return performedOperation;
    }, 0);
  });

  return parsedJSONdataWithFees;
}

async function calcCashOutCommissionFeesJuridical(
  parsedJSONdataWithFees,
  allUniqUserIds,
) {
  const feesConfig = await getFeesConfig('http://vps785969.ovh.net/cash-out-juridical');
  const cashOutFeeJuridical = feesConfig.percents / 100;
  const cashOutFeeMinJuridical = feesConfig.min.amount;

  allUniqUserIds.forEach((uniqUserID) => {
    const userOperations = parsedJSONdataWithFees.filter(
      (performedOperation) => performedOperation.user_id === uniqUserID,
    );

    const cashCashOutOperations = userOperations.filter(
      (performedOperation) => (performedOperation.user_type === 'juridical' && performedOperation.type === 'cash_out'),
    );

    cashCashOutOperations.forEach((performedOperation) => {
      const calcCashOutFeeJuridical = performedOperation.operation.amount * cashOutFeeJuridical;

      if (calcCashOutFeeJuridical <= cashOutFeeMinJuridical) {
        performedOperation.operation.commission_fee = cashOutFeeMinJuridical;
      } else {
        const fee = roundToSmallestCurrencyItem(calcCashOutFeeJuridical);
        performedOperation.operation.commission_fee = fee;
      }
    });
  });

  return parsedJSONdataWithFees;
}

function stdoutResult(parsedJSONdataWithFees) {
  parsedJSONdataWithFees.forEach((operation) => {
    if (operation.operation.commission_fee) {
      console.log(operation.operation.commission_fee.toFixed(2));
    } else {
      console.log((operation.operation.commission_fee = 0).toFixed(2));
    }
  });
}

export {
  calcCommissionFees,
  calcCashInCommissionFees,
  calcCashOutCommissionFeesNatural,
  calcCashOutCommissionFeesJuridical,
};
