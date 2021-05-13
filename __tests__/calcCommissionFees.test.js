import fs from 'fs';
import {
  calcCommissionFees,
  calcCashInCommissionFees,
  calcCashOutCommissionFeesNatural,
  calcCashOutCommissionFeesJuridical,
} from '../services/calcCommissionFees';

// TODO: test for main calcCommissionFees()
describe('Commission Fees calculation tests', () => {
  test('should caclulate commission fees for input file', async () => {
    // multi Object file test
    const dataFromFile = fs.readFileSync('input4.json');
    const result = await calcCommissionFees(dataFromFile);
    const properResultMultiObject = [
      {
        date: '2016-01-05',
        user_id: 1,
        user_type: 'natural',
        type: 'cash_in',
        operation: { amount: 200, currency: 'EUR', commission_fee: 0.06 },
      },
      {
        date: '2016-01-05',
        user_id: 1,
        user_type: 'natural',
        type: 'cash_out',
        operation: { amount: 400, currency: 'EUR', commission_fee: 0 },
      },
      {
        date: '2016-01-06',
        user_id: 2,
        user_type: 'juridical',
        type: 'cash_out',
        operation: { amount: 300, currency: 'EUR', commission_fee: 0.9 },
      },
      {
        date: '2016-01-06',
        user_id: 3,
        user_type: 'natural',
        type: 'cash_out',
        operation: { amount: 800, currency: 'EUR', commission_fee: 0 },
      },
      {
        date: '2016-01-06',
        user_id: 1,
        user_type: 'natural',
        type: 'cash_out',
        operation: { amount: 30000, currency: 'EUR', commission_fee: 88.2 },
      },
      {
        date: '2016-01-07',
        user_id: 1,
        user_type: 'natural',
        type: 'cash_out',
        operation: { amount: 1000, currency: 'EUR', commission_fee: 3 },
      },
      {
        date: '2016-01-07',
        user_id: 1,
        user_type: 'natural',
        type: 'cash_out',
        operation: { amount: 100, currency: 'EUR', commission_fee: 0.3 },
      },
      {
        date: '2016-01-08',
        user_id: 1,
        user_type: 'natural',
        type: 'cash_out',
        operation: { amount: 200, currency: 'EUR', commission_fee: 0.6 },
      },
      {
        date: '2016-01-10',
        user_id: 1,
        user_type: 'natural',
        type: 'cash_out',
        operation: { amount: 100, currency: 'EUR', commission_fee: 0.3 },
      },
      {
        date: '2016-01-10',
        user_id: 2,
        user_type: 'juridical',
        type: 'cash_in',
        operation: { amount: 1000000, currency: 'EUR', commission_fee: 5 },
      },
      {
        date: '2016-01-10',
        user_id: 3,
        user_type: 'natural',
        type: 'cash_out',
        operation: { amount: 1000, currency: 'EUR', commission_fee: 2.4 },
      },
      {
        date: '2016-01-11',
        user_id: 3,
        user_type: 'natural',
        type: 'cash_out',
        operation: { amount: 1224, currency: 'EUR', commission_fee: 0.68 },
      },
      {
        date: '2016-02-15',
        user_id: 1,
        user_type: 'natural',
        type: 'cash_out',
        operation: { amount: 300, currency: 'EUR', commission_fee: 0 },
      },
      {
        date: '2016-02-17',
        user_id: 4,
        user_type: 'natural',
        type: 'cash_out',
        operation: { amount: 1347, currency: 'EUR', commission_fee: 1.05 },
      },
      {
        date: '2016-02-18',
        user_id: 4,
        user_type: 'natural',
        type: 'cash_out',
        operation: { amount: 1500, currency: 'EUR', commission_fee: 4.5 },
      },
      {
        date: '2021-05-03',
        user_id: 1,
        user_type: 'natural',
        type: 'cash_out',
        operation: { amount: 980, currency: 'EUR', commission_fee: 0 },
      },
      {
        date: '2021-05-07',
        user_id: 1,
        user_type: 'natural',
        type: 'cash_out',
        operation: { amount: 20, currency: 'EUR', commission_fee: 0 },
      },
      {
        date: '2021-05-07',
        user_id: 1,
        user_type: 'natural',
        type: 'cash_out',
        operation: { amount: 800, currency: 'EUR', commission_fee: 2.4 },
      },
    ];

    expect(result).toEqual(properResultMultiObject);

    // single Object file test
    const properResultSingleObject = [
      {
        date: '2016-01-10',
        user_id: 3,
        user_type: 'natural',
        type: 'cash_out',
        operation: { amount: 1001, currency: 'EUR', commission_fee: 0.01 },
      },
    ];

    const dataFromFileSingleObject = fs.readFileSync('input2.json');

    expect(await calcCommissionFees(dataFromFileSingleObject)).toEqual(
      properResultSingleObject,
    );

    // check for handel error from parseJSON function
    expect(await calcCommissionFees(false)).toBeFalsy();
  });

  test('should return caclulated commission fees for Cash In operations', async () => {
    const parsedJSONdataWithFees = [
      {
        date: '2016-01-05',
        user_id: 1,
        user_type: 'natural',
        type: 'cash_in',
        operation: { amount: 200.0, currency: 'EUR' },
      },
      {
        date: '2016-01-06',
        user_id: 2,
        user_type: 'juridical',
        type: 'cash_in',
        operation: { amount: 100000.0, currency: 'EUR' },
      },
    ];

    const properResult = [
      {
        date: '2016-01-05',
        operation: { amount: 200, commission_fee: 0.06, currency: 'EUR' },
        type: 'cash_in',
        user_id: 1,
        user_type: 'natural',
      },
      {
        date: '2016-01-06',
        operation: { amount: 100000, commission_fee: 5, currency: 'EUR' },
        type: 'cash_in',
        user_id: 2,
        user_type: 'juridical',
      },
    ];

    const calculatedResult = await calcCashInCommissionFees(parsedJSONdataWithFees);

    expect(calculatedResult).toEqual(properResult);
  });

  test('should return caclulated commission fees for Cash Out Natural', async () => {
    const parsedJSONdataWithFees = [
      {
        date: '2016-01-05',
        user_id: 1,
        user_type: 'natural',
        type: 'cash_out',
        operation: { amount: 200.0, currency: 'EUR' },
      },
      {
        date: '2016-01-06',
        user_id: 2,
        user_type: 'natural',
        type: 'cash_out',
        operation: { amount: 100000.0, currency: 'EUR' },
      },
    ];

    const properResult = [
      {
        date: '2016-01-05',
        operation: { amount: 200, currency: 'EUR' },
        type: 'cash_out',
        user_id: 1,
        user_type: 'natural',
      },
      {
        date: '2016-01-06',
        operation: { amount: 100000, commission_fee: 297, currency: 'EUR' },
        type: 'cash_out',
        user_id: 2,
        user_type: 'natural',
      },
    ];

    const calculatedResult = await calcCashOutCommissionFeesNatural(parsedJSONdataWithFees);

    expect(calculatedResult).toEqual(properResult);
  });

  test('should return caclulated fees for Cash Out Juridical', async () => {
    const parsedJSONdataWithFees = [
      {
        date: '2016-01-05',
        user_id: 1,
        user_type: 'juridical',
        type: 'cash_out',
        operation: { amount: 200.0, currency: 'EUR' },
      },
      {
        date: '2016-01-06',
        user_id: 2,
        user_type: 'juridical',
        type: 'cash_out',
        operation: { amount: 100014.0, currency: 'EUR' },
      },
    ];

    const properResult = [
      {
        date: '2016-01-05',
        operation: { amount: 200, commission_fee: 0.6, currency: 'EUR' },
        type: 'cash_out',
        user_id: 1,
        user_type: 'juridical',
      },
      {
        date: '2016-01-06',
        operation: { amount: 100014, commission_fee: 300.05, currency: 'EUR' },
        type: 'cash_out',
        user_id: 2,
        user_type: 'juridical',
      },
    ];

    const calculatedResult = await calcCashOutCommissionFeesJuridical(parsedJSONdataWithFees);

    expect(calculatedResult).toEqual(properResult);
  });
});
