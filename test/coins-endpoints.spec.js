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
          expect(res.body.data.length).to.eql(10)
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
  
  // describe('GET /api/coins/dashboard', () => {
    
  // })
  
  // describe('GET /api/coins/:coin_id', () => {
    
  // })
  
  // describe('GET /api/coins/:coin_id/market', () => {
    
  // })
  
  // describe('GET /api/coins/:coin_slug/history/:days', () => {
    
  // })
  

});
