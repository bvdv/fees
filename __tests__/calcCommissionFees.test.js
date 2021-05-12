import {
  calcCommissionFees,
  calcCashInCommissionFees,
  calcCashOutCommissionFeesNatural,
  calcCashOutCommissionFeesJuridical,
} from '../services/calcCommissionFees';
import getNumberOfWeek from '../utils/getNumberOfWeek';

// TODO: test for main calcCommissionFees()
describe('Commission Fees calculation tests', () => {
  test('should caclulate commission fees for Cash In operations', async () => {
    const parsedJSONdataWithFees = [
      {
        date: '2016-01-05', user_id: 1, user_type: 'natural', type: 'cash_in', operation: { amount: 200.00, currency: 'EUR' },
      },
      {
        date: '2016-01-06', user_id: 2, user_type: 'juridical', type: 'cash_in', operation: { amount: 100000.00, currency: 'EUR' },
      },
    ];
    const allUniqUserIds = [1, 2];

    const properResult = [
      {
        date: '2016-01-05', operation: { amount: 200, commission_fee: 0.06, currency: 'EUR' }, type: 'cash_in', user_id: 1, user_type: 'natural',
      },
      {
        date: '2016-01-06', operation: { amount: 100000, commission_fee: 5, currency: 'EUR' }, type: 'cash_in', user_id: 2, user_type: 'juridical',
      },
    ];

    const calculatedResult = await calcCashInCommissionFees(
      parsedJSONdataWithFees,
      allUniqUserIds,
    );

    expect(calculatedResult).toEqual(properResult);
  });

  test('should caclulate commission fees for Cash Out Natural', async () => {
    const parsedJSONdataWithFees = [
      {
        date: '2016-01-05', user_id: 1, user_type: 'natural', type: 'cash_out', operation: { amount: 200.00, currency: 'EUR' },
      },
      {
        date: '2016-01-06', user_id: 2, user_type: 'natural', type: 'cash_out', operation: { amount: 100000.00, currency: 'EUR' },
      },
    ];
    const allUniqUserIds = [1, 2];

    const properResult = [
      {
        date: '2016-01-05', operation: { amount: 200, currency: 'EUR' }, type: 'cash_out', user_id: 1, user_type: 'natural',
      },
      {
        date: '2016-01-06', operation: { amount: 100000, commission_fee: 297, currency: 'EUR' }, type: 'cash_out', user_id: 2, user_type: 'natural',
      },
    ];

    const calculatedResult = await calcCashOutCommissionFeesNatural(
      parsedJSONdataWithFees,
      allUniqUserIds,
      getNumberOfWeek,
    );

    expect(calculatedResult).toEqual(properResult);
  });

  test('should caclulate commission fees for Cash Out Juridical', async () => {
    const parsedJSONdataWithFees = [
      {
        date: '2016-01-05', user_id: 1, user_type: 'juridical', type: 'cash_out', operation: { amount: 200.00, currency: 'EUR' },
      },
      {
        date: '2016-01-06', user_id: 2, user_type: 'juridical', type: 'cash_out', operation: { amount: 100014.00, currency: 'EUR' },
      },
    ];
    const allUniqUserIds = [1, 2];

    const properResult = [
      {
        date: '2016-01-05', operation: { amount: 200, commission_fee: 0.6, currency: 'EUR' }, type: 'cash_out', user_id: 1, user_type: 'juridical',
      },
      {
        date: '2016-01-06', operation: { amount: 100014, commission_fee: 300.05, currency: 'EUR' }, type: 'cash_out', user_id: 2, user_type: 'juridical',
      },
    ];

    const calculatedResult = await calcCashOutCommissionFeesJuridical(
      parsedJSONdataWithFees,
      allUniqUserIds,
    );

    expect(calculatedResult).toEqual(properResult);
  });
});
