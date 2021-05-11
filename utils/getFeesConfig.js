/**
 * TODO: make getFeesConfig return or data from local JSON
 * or from endpoints
 */

import axios from 'axios';

const getFeesConfig = async (feesConfigEndPoint) => {
  const endPoint = feesConfigEndPoint;

  if (endPoint) {
    try {
      const response = await axios.get(endPoint);
      return await response.data;
    } catch (error) {
      console.log('please provide proper JSON endpoint or requests qty per sec to high ');
      return false;
    }
  } else {
    return false;
  }
};

export default getFeesConfig;
