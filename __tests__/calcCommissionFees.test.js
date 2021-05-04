import {
    calcCommissionFees,
    calcCashInCommissionFees,
    calcCashOutCommissionFeesNatural,
    calcCashOutCommissionFeesJuridical
} from '../services/calcCommissionFees.js';
import getNumberOfWeek from '../utils/getNumberOfWeek';

describe('Commission Fees calculation tests', () => {
    test('calcCashInCommissionFees() test', () => {
        const parsedJSONdataWithFees = [
            { "date": "2016-01-05", "user_id": 1, "user_type": "natural", "type": "cash_in", "operation": { "amount": 200.00, "currency": "EUR" } },
            { "date": "2016-01-06", "user_id": 2, "user_type": "juridical", "type": "cash_in", "operation": { "amount": 100000.00, "currency": "EUR" } }
        ];
        const allUniqUserIds = [1, 2];
        const cashInFee = 0.0003;
        const cashInMaxFee = 5;

        const properResult = [
            { "date": "2016-01-05", "operation": { "amount": 200, "commission_fee": 0.06, "currency": "EUR" }, "type": "cash_in", "user_id": 1, "user_type": "natural" }, 
            { "date": "2016-01-06", "operation": { "amount": 100000, "commission_fee": 5, "currency": "EUR" }, "type": "cash_in", "user_id": 2, "user_type": "juridical" }
        ];

        const calculatedResult = calcCashInCommissionFees(
            parsedJSONdataWithFees,
            allUniqUserIds,
            cashInFee,
            cashInMaxFee
        );

        expect(calculatedResult).toEqual(properResult);
    });

    test('calcCashOutCommissionFeesNatural() test', () => {
        const parsedJSONdataWithFees = [
            { "date": "2016-01-05", "user_id": 1, "user_type": "natural", "type": "cash_out", "operation": { "amount": 200.00, "currency": "EUR" } },
            { "date": "2016-01-06", "user_id": 2, "user_type": "natural", "type": "cash_out", "operation": { "amount": 100000.00, "currency": "EUR" } }
        ];
        const allUniqUserIds = [1, 2];
        const cashOutWeekFeeNatural = 0.003;
        const cashOutWeekLimitNatural = 1000;
         
        const properResult = [
            { "date": "2016-01-05", "operation": { "amount": 200, "currency": "EUR" }, "type": "cash_out", "user_id": 1, "user_type": "natural" }, 
            { "date": "2016-01-06", "operation": { "amount": 100000, "commission_fee": 297, "currency": "EUR" }, "type": "cash_out", "user_id": 2, "user_type": "natural" }
        ];

        const calculatedResult = calcCashOutCommissionFeesNatural(
            parsedJSONdataWithFees,
            allUniqUserIds,
            cashOutWeekLimitNatural,
            cashOutWeekFeeNatural,
            getNumberOfWeek
        );

        expect(calculatedResult).toEqual(properResult);
    });

    test('calcCashOutCommissionFeesJuridical() test', () => {
        const parsedJSONdataWithFees = [
            { "date": "2016-01-05", "user_id": 1, "user_type": "juridical", "type": "cash_out", "operation": { "amount": 200.00, "currency": "EUR" } },
            { "date": "2016-01-06", "user_id": 2, "user_type": "juridical", "type": "cash_out", "operation": { "amount": 100000.00, "currency": "EUR" } }
        ];
        const allUniqUserIds = [1, 2];
        const cashOutFeeJuridical = 0.003;
        const cashOutFeeMinJuridical = 0.5;
         
        const properResult = [
            { "date": "2016-01-05", "operation": { "amount": 200, "commission_fee": 0.6, "currency": "EUR" }, "type": "cash_out", "user_id": 1, "user_type": "juridical" }, 
            { "date": "2016-01-06", "operation": { "amount": 100000, "commission_fee": 300, "currency": "EUR" }, "type": "cash_out", "user_id": 2, "user_type": "juridical" }
        ];

        const calculatedResult = calcCashOutCommissionFeesJuridical(
            parsedJSONdataWithFees,
            allUniqUserIds,
            cashOutFeeJuridical,
            cashOutFeeMinJuridical
        );

        expect(calculatedResult).toEqual(properResult);
    });
});