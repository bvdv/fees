import getFeesConfig from '../utils/getFeesConfig.js';
import getNumberOfWeek from '../utils/getNumberOfWeek';
import parseJSON from '../utils/parseJSON';

describe('Utils tests', () => {
  test('getFeesConfig() test', async () => {
    expect(await getFeesConfig()).toEqual(
      {
        "cashIn": {
          "max": {
            "amount": 5,
            "currency": "EUR"
          },
          "percents": 0.03
        },
        "cashOutJuridical": {
          "min": {
            "amount": 0.5,
            "currency": "EUR"
          },
          "percents": 0.3
        },
        "cashOutNatural": {
          "percents": 0.3,
          "week_limit": {
            "amount": 1000,
            "currency": "EUR"
          }
        }
      }
    );
  });

  test('getNumberOfWeek() test', () => {
    expect(getNumberOfWeek('2016-01-07')).toEqual(1);
    expect(getNumberOfWeek('2016-11-18')).toEqual(46);
    expect(getNumberOfWeek('2021-03-14')).toEqual(10);
    const sunday = new Date('2021-03-14');
    expect(sunday.getDay()).toEqual(0);
    expect(getNumberOfWeek('2021-03-15')).toEqual(11);
    const monday = new Date('2021-03-15');
    expect(monday.getDay()).toEqual(1);
    expect(getNumberOfWeek('2021-03-16')).toEqual(11);
    expect(getNumberOfWeek('2021-03-17')).toEqual(11);
    expect(getNumberOfWeek('2021-03-18')).toEqual(11);
    expect(getNumberOfWeek('2021-03-19')).toEqual(11);
    expect(getNumberOfWeek('2021-03-20')).toEqual(11);
    expect(getNumberOfWeek('2021-03-21')).toEqual(11);
    expect(getNumberOfWeek('2021-03-22')).toEqual(12);
  });

  test('parseJSON() test', () => {
    const properJSON = [
      { "date": "2016-01-05", "user_id": 1, "user_type": "natural", "type": "cash_in", "operation": { "amount": 200.00, "currency": "EUR" } },
      { "date": "2016-01-06", "user_id": 2, "user_type": "juridical", "type": "cash_out", "operation": { "amount": 300.00, "currency": "EUR" } } 
    ];
    const stringJSON = JSON.stringify(properJSON);
    const notProperJSON = [
      "{ \"date\": \"2016-01-05\", \"user_id\": 1, \"user_type\": \"natural\"},"
    ];
    expect(parseJSON(stringJSON)).toEqual(properJSON);
    expect(parseJSON(notProperJSON)).toEqual(false);
  });
});


