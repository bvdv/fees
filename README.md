# Fees

## About

APP for calculating commission fees according Fees Config

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
