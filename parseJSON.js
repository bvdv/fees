// FIXME: JSON spec doesn't allow trailing comma, but ES5 allow

const parseJSON = JSONForParsing => {
  try {
    const parsedJSON = JSON.parse(JSONForParsing);
    return parsedJSON;
  } catch (err) {
    console.log('please provide proper JSON, error msg:', err.message);
  }
}

export default parseJSON;