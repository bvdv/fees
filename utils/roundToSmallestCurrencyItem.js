/**
 * TODO: need more info about floating point number precision
 * https://github.com/openexchangerates/accounting.js
 * https://github.com/MikeMcl/decimal.js/
 * https://github.com/MikeMcl/big.js/wiki#what-is-the-difference-between-bigjs-bignumberjs-and-decimaljs
 */
const roundToSmallestCurrencyItem = (roundFee) => {
  const roundedFee = Math.ceil(roundFee * 100 + Number.EPSILON) / 100;
  return roundedFee;
};

export default roundToSmallestCurrencyItem;
