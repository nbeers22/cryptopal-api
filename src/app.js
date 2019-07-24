require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const helmet = require('helmet');
const rp = require('request-promise');
const { NODE_ENV } = require('./config');

const app = express();

const morganSetting = 
  NODE_ENV === "production"
  ? "tiny"
  : "dev"

app.use(morgan(morganSetting));
app.use(helmet());
app.use(cors());
app.use(express.json()); 

app.get('/', (req, res) => {
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
  }).catch((err) => {
    console.log('API call error:', err.message);
  });

   
});

const errorHandler = (error,req,res,next) => {
  let response;
  if (NODE_ENV === "production") {
    response = { error : { message: "server error" } }
  }else{
    console.error(error);
    response = { message: error.message, error }
  }
  res.status(500).json(response);
}

app.use(errorHandler);

module.exports = app;