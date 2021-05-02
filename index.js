"use strict";
import calcCommissionFees from './services/calcCommissionFees.js';
import readInputFile from './utils/readInputFile.js';
import parseJSON from './utils/parseJSON.js';
import getNumberOfWeek from './utils/getNumberOfWeek.js';
import cashIn from './config/cash-in.js';
import cashOutJuridical from './config/cash-out-juridical.js';
import cashOutNatural from './config/cash-out-natural.js';

calcCommissionFees(
    readInputFile,
    parseJSON,
    getNumberOfWeek,
    cashIn,
    cashOutNatural,
    cashOutJuridical
);