# Sample - Create an order with Coinbase Commerce payment gateway
The following project is just a boilerplater/sample on how to create an order and use Coinbase Commerce as a payment gateway.

## Environment varilables  .env
```
NODE_ENV=production
URL_MAIN=https://555ab16644b7.ngrok.io
URL_ON_SUCCESS=https://555ab16644b7.ngrok.io  

COINBASE_API_KEY=''
COINBASE_WEBHOOK_SECRET='' 
```

## Instructions
 
```
$ npm install
$ tsc -w
$ node dist/server
```

## Method
 
* Endpoint: https://555ab16644b7.ngrok.io/api/order
* Method: POST
* Body (JSON)
```
{
    "amount": 100.00
}
```

## Response
```
{
    "redirect_url": "https://commerce.coinbase.com/charges/KH9VT2H4"
}
```