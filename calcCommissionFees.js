import readInputFile from './readInputFile.js';
import parseJSON from './parseJSON.js';


const calcCommissionFees = () => {
  const readFile = readInputFile();
  console.log(parseJSON(readFile));
}

export default calcCommissionFees;

