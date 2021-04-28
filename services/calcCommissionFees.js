// import readInputFile from '../utils/readInputFile.js';
// import parseJSON from '../utils/parseJSON.js';

const calcCommissionFees = (readInputFile, parseJSON) => {
  const readFile = readInputFile();
  const parsedJSON = parseJSON(readFile);
  // for () used because better performance
  for (let index = 0; index < parsedJSON.length; index++) {
    const element = parsedJSON[index].date;
    console.log('-->', element)
  }
}

export default calcCommissionFees;

