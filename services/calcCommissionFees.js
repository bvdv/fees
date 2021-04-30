const calcCommissionFees = (readInputFile, parseJSON, getNumberOfWeek) => {
  const readFile = readInputFile();
  const parsedJSONdata = parseJSON(readFile);
  getNumberOfWeek();

  if (parsedJSONdata.length) {
    let allUniqUserIds = [
      ...new Set(parsedJSONdata.map(({ user_id }) => user_id)),
    ];

    allUniqUserIds.forEach((uniqUserId) => {
      parsedJSONdata.filter(({ date, user_id, user_type, type, operation }) => {
        if (uniqUserId === user_id) {
          console.log("uniq user id -->", uniqUserId);
          console.log(date);
          console.log(getNumberOfWeek(date));
        }
      });
    });
  } else {
    console.log("-->", parsedJSONdata.date);
  }
};

export default calcCommissionFees;
