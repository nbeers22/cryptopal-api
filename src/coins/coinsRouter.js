
const express = require('express');
const rp = require('request-promise');

const coinsRouter = express.Router()
const jsonParser = express.json()

coinsRouter
  .get( '/', (req, res, next) => {
    const { start, limit, convert } = req.body;
    const requestOptions = {
      method: 'GET',
      uri: 'https://pro-api.coinmarketcap.com/v1/cryptocurrency/listings/latest',
      qs: {
        'start': start || '1',
        'limit': limit || '100',
        'convert': convert || 'USD'
      },
      headers: {
        'X-CMC_PRO_API_KEY': process.env.CMC_API_KEY
      },
      json: true,
      gzip: true
    };

    rp(requestOptions).then(response => {
      res
      .status(200)
      .json(response)
    })
    .catch(next);
  });

coinsRouter
  .route('/dashboard')
  .get( (req,res,next) => {
    const requestOptions = {
      method: 'GET',
      uri: 'https://pro-api.coinmarketcap.com/v1/cryptocurrency/listings/latest',
      qs: {
        'start': '1',
        'limit': '4000',
        'convert': 'USD'
      },
      headers: {
        'X-CMC_PRO_API_KEY': process.env.CMC_API_KEY
      },
      json: true,
      gzip: true
    };

    rp(requestOptions).then(response => {
      res.json(response)
    })
    .catch(next);
  })

coinsRouter
  .route('/:coin_id')
  .get( (req,res,next) => {
    const { coin_id } = req.params;
    const requestOptions = {
      method: 'GET',
      uri: 'https://pro-api.coinmarketcap.com/v1/cryptocurrency/info',
      qs: {
        'id': coin_id
      },
      headers: {
        'X-CMC_PRO_API_KEY': process.env.CMC_API_KEY
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
        'X-CMC_PRO_API_KEY': process.env.CMC_API_KEY
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
  .route('/:coin_slug/history/:days')
  .get( (req,res,next) => {
    const { days, coin_slug } = req.params
    const requestOptions = {
      method: 'GET',
      uri: `https://api.coingecko.com/api/v3/coins/${coin_slug}/market_chart`,
      qs: {
        'vs_currency': 'usd',
        'days': days || 30
      },
      headers: {
        'Apikey': process.env.COINGECKO_API_KEY
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