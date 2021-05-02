"use strict";
import fs from 'fs';

/**
 * TODO: extend function for more arguments and flags,
 * different file extensions and etc.
 */

const inputFile = process.argv[2];

const readInputFile = () => {
  if (fs.existsSync(inputFile)) {
    const dataFromFile = fs.readFileSync(inputFile);
    return dataFromFile;
  }
  
  console.log('please add file to project folder and use as example shows: node index.js yourFile.*');
  return false;

}

export default readInputFile;