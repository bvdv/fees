"use strict";
/**
 * https://www.freeformatter.com/json-validator.html 
 * compare JSON (RFC 4627) and JS JSON
 */

// FIXME: JSON spec (RFC 4627) and JSON.parse() doesn't allow trailing comma, but JS allow
const parseJSON = JSONForParsing => {
  try {
    const parsedJSON = JSON.parse(JSONForParsing);
    return parsedJSON;
  } catch (err) {
    console.log('please provide proper JSON, error msg:', err.message);
    return false;
  }
}

export default parseJSON;