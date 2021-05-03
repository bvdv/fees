"use strict";
import calcCommissionFees from './services/calcCommissionFees.js';
import readInputFile from './utils/readInputFile.js';
import parseJSON from './utils/parseJSON.js';
import getNumberOfWeek from './utils/getNumberOfWeek.js';
import getFeesConfig from './utils/getFeesConfig.js';

calcCommissionFees(
    readInputFile,
    parseJSON,
    getNumberOfWeek,
    getFeesConfig
);