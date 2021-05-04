/**
 * TODO: make getFeesConfig return or data from local JSON 
 * or from endpoints
 */

import axios from 'axios';
import cashIn from '../config/cash-in.js';
import cashOutNatural from '../config/cash-out-natural.js';
import cashOutJuridical from '../config/cash-out-juridical.js';

const getFeesConfig = async feesConfigEndPoints => {

    if (feesConfigEndPoints) {
        try {
            const response = await axios.get(feesConfigEndpoints);
            return await response.data;
        } catch (error) {
            // console.error(error);
            console.log('please provide proper JSON end point')
            return false;
        }
    } else {
        return {
            cashIn,
            cashOutNatural,
            cashOutJuridical
        };
    }
}

export default getFeesConfig;