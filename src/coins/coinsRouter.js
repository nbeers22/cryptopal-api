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

  module.exports = coinsRouter;