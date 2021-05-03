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

  test('getNumberOfWeek() test', async () => {
    let data1 = getNumberOfWeek('2016-01-07');
    expect(data1).toEqual(1);
    let data2 = getNumberOfWeek('2016-11-18');
    expect(data2).toEqual(46);
    let data3 = getNumberOfWeek('2021-03-18');
    expect(data3).toEqual(11);
  });

  test('parseJSON() test', async () => {
  });
});


