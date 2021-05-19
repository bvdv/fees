import readInputFile from '../utils/readInputFile.js';
import parseJSON from '../utils/parseJSON.js';
import getNumberOfWeek from '../utils/getNumberOfWeek.js';
import getFeesConfig from '../utils/getFeesConfig.js';
import roundToSmallestCurrencyItem from '../utils/roundToSmallestCurrencyItem.js';
/**
 * TODO:
 * 1. make parsedJSONdataWithFees immutable
 *
 * 2. make calcCommissionFees function with
 * for loop and if..elseif for performance benchmark against forEach, filter, reduce and etc.
 */
const calcCommissionFees = async (readFile = readInputFile()) => {
  const parsedJSONdata = parseJSON(readFile);

  let parsedJSONdataWithFees = [];

  if (parsedJSONdata) {
    // check for single object JSON
    if (typeof parsedJSONdata[Symbol.iterator] !== 'function') {
      parsedJSONdataWithFees.push(parsedJSONdata);
    } else {
      parsedJSONdataWithFees = [...parsedJSONdata];
    }

    await calcCashInCommissionFees(parsedJSONdataWithFees);

    await calcCashOutCommissionFeesNatural(parsedJSONdataWithFees);

    await calcCashOutCommissionFeesJuridical(parsedJSONdataWithFees);

    stdoutResult(parsedJSONdataWithFees);

    return parsedJSONdataWithFees;
  }

  return false;
};

async function calcCashInCommissionFees(parsedJSONdataWithFees) {
  const feesConfig = await getFeesConfig('http://vps785969.ovh.net/cash-in');
  const cashInFee = feesConfig.percents / 100;
  const cashInMaxFee = feesConfig.max.amount;
  const cashInUserOperations = sorting(parsedJSONdataWithFees, 'cash_in');

  cashInUserOperations.forEach((performedOperation) => {
    const calcCashInFee = performedOperation.operation.amount * cashInFee;

    if (calcCashInFee >= cashInMaxFee) {
      performedOperation.operation.commission_fee = cashInMaxFee;
    } else {
      const fee = roundToSmallestCurrencyItem(calcCashInFee);
      performedOperation.operation.commission_fee = fee;
    }
  });

  return parsedJSONdataWithFees;
}

async function calcCashOutCommissionFeesNatural(parsedJSONdataWithFees) {
  const feesConfig = await getFeesConfig('http://vps785969.ovh.net/cash-out-natural');
  const cashOutWeekFeeNatural = feesConfig.percents / 100;
  const cashOutWeekLimitNatural = feesConfig.week_limit.amount;
  const cashCashOutOperations = sorting(parsedJSONdataWithFees, 'cash_out', 'natural');
  let userWeekTotalCashOut = 0;
  let firstWeekLimitExcess;

  // sort operations by user_id
  cashCashOutOperations.sort((a, b) => a.user_id - b.user_id);

  cashCashOutOperations.reduce((prevPerformedOperation, performedOperation) => {
    const currentWeek = getNumberOfWeek(performedOperation.date);
    const prevWeek = getNumberOfWeek(prevPerformedOperation.date);
    // reset userWeekTotalCashOut if new week started or new user_id
    if (
      performedOperation.user_id !== prevPerformedOperation.user_id
      || currentWeek !== prevWeek
    ) {
      userWeekTotalCashOut = 0;
      firstWeekLimitExcess = false;
    }

    userWeekTotalCashOut += performedOperation.operation.amount;

    if (performedOperation && userWeekTotalCashOut > cashOutWeekLimitNatural) {
      if (!firstWeekLimitExcess) {
        // calculate fee for first occurrence of cash out week limit excess
        firstWeekLimitExcess = true;
        const fee = (userWeekTotalCashOut - cashOutWeekLimitNatural) * cashOutWeekFeeNatural;
        performedOperation.operation.commission_fee = roundToSmallestCurrencyItem(fee);
      } else {
        // calculate fee if cash out week limit exceeded
        const fee = performedOperation.operation.amount * cashOutWeekFeeNatural;
        performedOperation.operation.commission_fee = roundToSmallestCurrencyItem(fee);
      }
    }

    return performedOperation;
  }, 0);

  return parsedJSONdataWithFees;
}

async function calcCashOutCommissionFeesJuridical(parsedJSONdataWithFees) {
  const feesConfig = await getFeesConfig('http://vps785969.ovh.net/cash-out-juridical');
  const cashOutFeeJuridical = feesConfig.percents / 100;
  const cashOutFeeMinJuridical = feesConfig.min.amount;
  const cashCashOutOperations = sorting(parsedJSONdataWithFees, 'cash_out', 'juridical');

  cashCashOutOperations.forEach((performedOperation) => {
    const calcCashOutFeeJuridical = performedOperation.operation.amount * cashOutFeeJuridical;

    if (calcCashOutFeeJuridical <= cashOutFeeMinJuridical) {
      performedOperation.operation.commission_fee = cashOutFeeMinJuridical;
    } else {
      const fee = roundToSmallestCurrencyItem(calcCashOutFeeJuridical);
      performedOperation.operation.commission_fee = fee;
    }
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

function sorting(
  parsedJSONdataWithFees,
  operationType = false,
  userType = false,
) {
  if (userType === 'natural' || userType === 'juridical') {
    const sortedUserOperations = parsedJSONdataWithFees.filter(
      (performedOperation) => (
        performedOperation.user_type === userType && performedOperation.type === operationType
      ),
    );
    return sortedUserOperations;
  }

  if (operationType === 'cash_in' && !userType) {
    const sortedUserOperations = parsedJSONdataWithFees.filter(
      (performedOperation) => (performedOperation.type === operationType),
    );
    return sortedUserOperations;
  }

  return false;
}

export {
  calcCommissionFees,
  calcCashInCommissionFees,
  calcCashOutCommissionFeesNatural,
  calcCashOutCommissionFeesJuridical,
};
