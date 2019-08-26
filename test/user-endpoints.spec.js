const knex = require('knex')
const app = require('../src/app')
const helpers = require('./test-helpers')
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const xss = require('xss');

describe.only('User Endpoints', () => {
  let db;

  const testUsers = helpers.makeUsersArray()
  const testUser = testUsers[0]

  const updateNameBody = {
    name: "New Name"
  }

  before('make knex instance', () => {
    db = knex({
      client: 'pg',
      connection: process.env.TEST_DB_URL,
    })
    app.set('db', db)
  })

  after('disconnect from db', () => db.destroy())

  before('cleanup', () => helpers.cleanTables(db))

  afterEach('cleanup', () => helpers.cleanTables(db))

  describe('PATCH /api/users/:user_id', () => {

    context('Valid Request', () => {
      beforeEach('insert users', () => { 
        helpers.seedUsers( db, testUsers);
      });

      it(`responds with 200 and updates user's name in database`, () => {
        const authToken = helpers.createJwt(testUser.email, { user_id: testUser.id});
  
        return supertest(app)
          .patch(`/api/users/${testUser.id}`)
          .send(updateNameBody)
          .set({"Authorization": `Bearer ${authToken}`})
          .expect(200, {
            name: updateNameBody.name
          })
      })
      
      it(`responds with 200 and updates user's password in database`, () => {
        const updatePasswordBody = {
          oldPassword: "password",
          newPassword: "password1"
        }

        const authToken = helpers.createJwt(testUser.email, { user_id: testUser.id});
  
        return supertest(app)
          .patch(`/api/users/${testUser.id}`)
          .send(updatePasswordBody)
          .set({"Authorization": `Bearer ${authToken}`})
          .expect(200)
          .expect(res => {
            expect(res.body).to.be.an('object')
            expect(res.body).to.have.all.keys('password', 'name', 'id', 'favorites', 'email', 'date_modified', 'date_created')
          })
      })
    });

    context('Invalid Request', () => {
      
      it('responds with 401 error when Authorization header is not sent with request', () => {
        return supertest(app)
          .patch(`/api/users/${testUser.id}`)
          .send(updateNameBody)
          .expect(401,{
            error: "Missing bearer token"
          })
      });
      
      it('responds with 401 error when bearer token is expired', () => {
        const authToken = jwt.sign(
          { user_id: testUser.id },
          process.env.JWT_SECRET,
          {
            subject: testUser.email,
            expiresIn: '1s',
            algorithm: 'HS256',
          }
        )
        setTimeout( () => {
          return supertest(app)
          .patch(`/api/users/${testUser.id}`)
          .send(updateNameBody)
          .set({"Authorization": `Bearer ${authToken}`})
          .expect(401,{
            error: "Token expired"
          })
        },1200)
  
      });
      
      it('responds with 401 error when authorized user is not found in database', () => {
        const authToken = helpers.createJwt(testUser.email, { user_id: testUser.id});
          return supertest(app)
          .patch(`/api/users/999`)
          .send(updateNameBody)
          .set({"Authorization": `Bearer ${authToken}`})
          .expect(401,{
            error: "Unauthorized request"
          })
      });
    });
  })
  
  describe('GET /api/users/:user_id/favorites', () => {

    beforeEach('insert users', () => { 
      helpers.seedUsers( db, testUsers);
    });
      
    it(`responds with 200 and user's favorites`, () => {
      return supertest(app)
        .get(`/api/users/${testUser.id}/favorites`)
        .expect(200, {
          favorites: testUser.favorites
        })
    })
    
    it(`responds with 404 if user id is not found in database`, () => {
      return supertest(app)
        .get(`/api/users/9999/favorites`)
        .expect(404)
    });
  });
  
  describe.only('POST /api/users/favorites', () => {

    beforeEach('insert users', () => { 
      helpers.seedUsers( db, testUsers);
    });

    it('responds with 401 if coin id is already found in favorites', async() => {
      const authToken = helpers.createJwt( testUser.email, { user_id: testUser.id } );
      const userFavBody = {
        coinID: testUser.favorites[0]
      }

      return supertest(app)
        .post('/api/users/favorites')
        .send(userFavBody)
        .set({"Authorization": `Bearer ${authToken}`})
        .expect(401,{
          error: "Coin already exists in favorites" 
        })
    });
    
    it('responds with 204 if coin id is successfully added to favorites', async() => {
      const authToken = helpers.createJwt( testUser.email, { user_id: testUser.id } );
      const userFavBody = {
        coinID: 9999
      }

      return supertest(app)
        .post('/api/users/favorites')
        .send(userFavBody)
        .set({"Authorization": `Bearer ${authToken}`})
        .expect(204);
    });
  });
});
