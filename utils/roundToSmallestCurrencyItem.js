"use strict";

const roundToSmallestCurrencyItem = (roundFee) => {
  const roundedFee = Math.ceil(roundFee * 100 + Number.EPSILON) / 100;
  return roundedFee;
}

export default roundToSmallestCurrencyItem;