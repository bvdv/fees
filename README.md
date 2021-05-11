# Fees

## About

APP for calculating commission fees according Fees Config.
Currently has Fees config for Cash In, Cash Out for Natural and Juridical person.

## Commission Fees

### For Cash In
Commission fee - 0.03% from total amount, but no more than 5.00 EUR.

### For Cash Out
There are different commission fees for cash out for natural and legal persons.

#### Natural Persons
Default commission fee - 0.3% from cash out amount.

1000.00 EUR per week (from monday to sunday) is free of charge.

If total cash out amount is exceeded - commission is calculated only from exceeded amount (that is, for 1000.00 EUR there is still no commission fee).

#### Legal persons
Commission fee - 0.3% from amount, but not less than 0.50 EUR for operation.

### Rounding
After calculating commission fee, it's rounded to the smallest currency item (for example, for EUR currency - cents) to upper bound (ceiled). For example, 0.023 EUR should be rounded to 3 Euro cents.

## Install
```npm i```

## Usage
Add to project proper JSON file (RFC 4627) - yourJSON.json, with structure like below:

```
[
    { "date": "2016-01-05", "user_id": 1, "user_type": "natural", "type": "cash_in", "operation": { "amount": 200.00, "currency": "EUR" } },
    { "date": "2016-01-06", "user_id": 2, "user_type": "juridical", "type": "cash_out", "operation": { "amount": 300.00, "currency": "EUR" } },
    { "date": "2016-01-06", "user_id": 1, "user_type": "natural", "type": "cash_out", "operation": { "amount": 30000, "currency": "EUR" } }
]
```

### Perform command

```node index.js input.json```

### APP outputs caclulated commision fees for each operation according Fees Config 

```
0.06
0.90
87.00
```

## Tests

### Perform command

for Windows
```
npm run test-w
```

## ESLint

### Perform command 

fix *.js files by Airbnb JavaScript Style Guide

```
npm run lint
```
