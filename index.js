import calcCommissionFees from './services/calcCommissionFees.js';
import readInputFile from './utils/readInputFile.js';
import parseJSON from './utils/parseJSON.js';

calcCommissionFees(readInputFile, parseJSON);