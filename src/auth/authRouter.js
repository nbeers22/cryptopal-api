const express = require('express');

const authRouter = express.Router()
const jsonParser = express.json()

authRouter
  .post( '/login', jsonParser, (req, res, next) => {
    
  });

authRouter
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

authRouter
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

authRouter
  .route('/:coin_slug/history/:days')
  .get( (req,res,next) => {
    const slug = req.params.coin_slug;
    const {days} = req.params
    const requestOptions = {
      method: 'GET',
      uri: `https://api.coingecko.com/api/v3/coins/${slug}/market_chart`,
      qs: {
        'vs_currency': 'usd',
        'days': days || 30
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

  module.exports = authRouter;