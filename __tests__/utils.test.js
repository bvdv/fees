import fs from 'fs';
import getFeesConfig from '../utils/getFeesConfig';
import getNumberOfWeek from '../utils/getNumberOfWeek';
import parseJSON from '../utils/parseJSON';
import readInputFile from '../utils/readInputFile';
import roundToSmallestCurrencyItem from '../utils/roundToSmallestCurrencyItem';

describe('Utils tests', () => {
  test('should get Fees Config from API endpoint', async () => {
    const feeConfigCashIn = await getFeesConfig('http://vps785969.ovh.net/cash-in');
    expect(feeConfigCashIn).toEqual(
      {
        max: {
          amount: 5,
          currency: 'EUR',
        },
        percents: 0.03,
      },
    );

    const feeConfigCashOutJuridical = await getFeesConfig('http://vps785969.ovh.net/cash-out-juridical');
    expect(feeConfigCashOutJuridical).toEqual(
      {
        min: {
          amount: 0.5,
          currency: 'EUR',
        },
        percents: 0.3,
      },
    );

    const feeConfigCashOutNatural = await getFeesConfig('http://vps785969.ovh.net/cash-out-natural');
    expect(feeConfigCashOutNatural).toEqual(
      {
        percents: 0.3,
        week_limit: {
          amount: 1000,
          currency: 'EUR',
        },
      },
    );
  });

  test('should return ISO number of week', () => {
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

  test('should parse input file to JSON', () => {
    const properJSON = [
      {
        date: '2016-01-05', user_id: 1, user_type: 'natural', type: 'cash_in', operation: { amount: 200.00, currency: 'EUR' },
      },
      {
        date: '2016-01-06', user_id: 2, user_type: 'juridical', type: 'cash_out', operation: { amount: 300.00, currency: 'EUR' },
      },
    ];
    const stringJSON = `[
      { "date": "2016-01-05", "user_id": 1, "user_type": "natural", "type": "cash_in", "operation": { "amount": 200.00, "currency": "EUR" } },
      { "date": "2016-01-06", "user_id": 2, "user_type": "juridical", "type": "cash_out", "operation": { "amount": 300.00, "currency": "EUR" } } 
    ]`;
    const notProperJSON = '{ "date": "2016-01-05", "user_id": 1, "user_type": "natural"},';
    expect(parseJSON(stringJSON)).toEqual(properJSON);
    expect(parseJSON(notProperJSON)).toBeFalsy();
  });

  test('should read input file', () => {
    // file not exist
    expect(readInputFile('input.jso')).toBeFalsy();

    // file exist
    const dataFromFile = fs.readFileSync('input.json');
    expect(readInputFile('input.json')).toEqual(dataFromFile);
  });

  test('should round fee to smallest currency item', () => {
    expect(roundToSmallestCurrencyItem('string')).toBeFalsy();

    expect(roundToSmallestCurrencyItem('1.231')).toEqual(1.24);

    expect(roundToSmallestCurrencyItem('1.2303')).toEqual(1.24);

    expect(roundToSmallestCurrencyItem(0.2303)).toEqual(0.24);

    expect(roundToSmallestCurrencyItem(1.2300003)).toEqual(1.24);

    expect(roundToSmallestCurrencyItem(0.23000000000000003)).toEqual(0.24);
    // TODO: need more info about floating point number precision
    expect(roundToSmallestCurrencyItem(0.230000000000000003)).toEqual(0.23);
  });
});
