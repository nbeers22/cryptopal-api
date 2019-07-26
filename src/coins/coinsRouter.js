const express = require('express');
const rp = require('request-promise');

const coinsRouter = express.Router()
const jsonParser = express.json()

coinsRouter
  .route('/')
  .get( (req, res, next) => {
    const requestOptions = {
      method: 'GET',
      uri: 'https://pro-api.coinmarketcap.com/v1/cryptocurrency/listings/latest',
      qs: {
        'start': '1',
        'limit': '3',
        'convert': 'USD'
      },
      headers: {
        'X-CMC_PRO_API_KEY': 'fe600837-03f2-4c7d-8ab9-374c7b5ea09c'
      },
      json: true,
      gzip: true
    };

    rp(requestOptions).then(response => {
      res.json(response)
    })
    .catch(next);
  });

coinsRouter
  .route('/:coin_id')
  .get( (req,res,next) => {
    const coinID = req.params.coin_id;
    const requestOptions = {
      method: 'GET',
      uri: 'https://pro-api.coinmarketcap.com/v1/cryptocurrency/info',
      qs: {
        'id': coinID
      },
      headers: {
        'X-CMC_PRO_API_KEY': 'fe600837-03f2-4c7d-8ab9-374c7b5ea09c'
      },
      json: true,
      gzip: true
    };

    rp(requestOptions).then(response => {
      res.json(response)
    })
    .catch(next);
  });

coinsRouter
  .route('/:coin_id/market')
  .get( (req,res,next) => {
    const coinID = req.params.coin_id;
    const requestOptions = {
      method: 'GET',
      uri: 'https://pro-api.coinmarketcap.com/v1/cryptocurrency/quotes/latest',
      qs: {
        'id': coinID
      },
      headers: {
        'X-CMC_PRO_API_KEY': 'fe600837-03f2-4c7d-8ab9-374c7b5ea09c'
      },
      json: true,
      gzip: true
    };

    rp(requestOptions).then(response => {
      res.json(response)
    })
    .catch(next);
  });

coinsRouter
  .route('/:coin_symbol/history')
  .get( (req,res,next) => {
    const symbol = req.params.coin_symbol;
    const requestOptions = {
      method: 'GET',
      uri: `https://min-api.cryptocompare.com/data/histoday?fsym=${symbol}&tsym=USD&limit=30`,
      qs: {
        'id': coinID
      },
      headers: {
        'Apikey': '0ae8b16fe3fc03c68ed8452fd65370405e9600cd423f48749fef152f46655816'
      },
      json: true,
      gzip: true
    };

    rp(requestOptions).then(response => {
      res.json(response)
    })
    .catch(next);
  });

  module.exports = coinsRouter;