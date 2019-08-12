const app = require('../src/app')
const helpers = require('./test-helpers')

describe.only('Coins Endpoints', () => {

  describe('GET /api/coins', () => {
    it("should respond with JSON data of latest coins with body params sent", () => {
      const bodyParams = {
        start: 1,
        limit: 10,
        convert: 'USD'
      }
      return supertest(app)
        .get('/api/coins')
        .send(bodyParams)
        .expect(200)
        .expect( res => {
          expect(res.body.data.length).to.eql(bodyParams.limit)
          expect(res.body.data[0].name).to.eql("Bitcoin")
        })
    })
    
    it("should respond with JSON data of latest coins without body params sent", () => {
      return supertest(app)
        .get('/api/coins')
        .expect(200)
        .expect( res => {
          expect(res.body.data.length).to.eql(100)
          expect(res.body.data[0].name).to.eql("Bitcoin")
        })
    })
  })
  
  describe('GET /api/coins/dashboard', () => {
    it("should respond with JSON data of all coins listed in CMC API", () => {
      return supertest(app)
        .get('/api/coins/dashboard')
        .expect(200)
        .expect( res => {
          expect(res.body.data.length).to.be.above(2000)
        })
    })
  })
  
  describe('GET /api/coins/:coin_id', () => {
    it("should respond with 200 JSON data of specified coin id", () => {
      const coinID = 1;
      return supertest(app)
        .get(`/api/coins/${coinID}`)
        .expect(200)
        .expect( res => {
          expect(Object.keys(res.body.data).length).to.eql(1)
          expect(res.body.data[coinID].name).to.eql("Bitcoin")
        })
    })

    it("should respond with 500 if coin id is not found", () => {
      const coinID = 9600;
      return supertest(app)
        .get(`/api/coins/${coinID}`)
        .expect(500)
    })
  })
  
  describe('GET /api/coins/:coin_id/market', () => {
    it("should respond with 200 JSON data of specified coin id", () => {
      const coinID = 1;
      return supertest(app)
        .get(`/api/coins/${coinID}/market`)
        .expect(200)
        .expect( res => {
          expect(Object.keys(res.body.data).length).to.eql(1)
          expect(res.body.data[coinID].name).to.eql("Bitcoin")
        })
    })
  })
  
  describe.only('GET /api/coins/:coin_slug/history/:days', () => {
    it("should respond with JSON data of specified coin id", () => {
      const coinSlug = "bitcoin"
      const days = 100;
      return supertest(app)
        .get(`/api/coins/${coinSlug}/history/${days}`)
        .expect(200)
        .expect( res => {
          expect(res.body.prices).to.be.an('array')
          expect(res.body.market_caps).to.be.an('array')
          expect(res.body.total_volumes).to.be.an('array')
          expect(res.body.prices.length).to.eql(days + 1)
          expect(res.body.market_caps.length).to.eql(days + 1)
          expect(res.body.total_volumes.length).to.eql(days + 1)
          res.body.prices.forEach( priceArray => {
            expect(priceArray.length).to.eql(2)
            expect(priceArray[0]).to.satisfy(Number.isInteger)
          })
        })
    })
  })
  

});
