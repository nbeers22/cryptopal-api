const knex = require('knex')
const app = require('../src/app')
const helpers = require('./test-helpers')

describe('Auth Endpoints', () => {
  
  let db;

  const testUsers = helpers.makeUsersArray()
  const testUser = testUsers[0]

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

  describe('POST /api/auth/login', () => {
    beforeEach('insert users', () => 
      helpers.seedUsers( db, testUsers)
    )

    const requiredFields = ['email', 'password'];

    requiredFields.forEach( field => {
      const loginAttemptBody = {
        email: testUser.email,
        password: testUser.password,
      }

      it(`responds with 400 required error when ${field} is missing`, () => {
        delete loginAttemptBody[field]

        return supertest(app)
          .post("/api/auth/login")
          .send(loginAttemptBody)
          .expect(400, {
            error: `Missing ${field} in request`
          })
      })
    });

    it(`responds with 400 error when user email is not found in database`, () => { 
      const fakeUser = {
        email: 'fake.email@mail.com',
        password: 'fakePassword'
      }

      return supertest(app)
        .post("/api/auth/login")
        .send(fakeUser)
        .expect(400, {
          error: `Incorrect email and/or password`
        })
    })
    
    it(`responds with 400 error when user email found but password is wrong`, () => { 
      const userWithBadPassword = {
        email: testUser.email,
        password: 'fakePassword'
      }

      return supertest(app)
        .post("/api/auth/login")
        .send(userWithBadPassword)
        .expect(400, {
          error: `Incorrect email and/or password`
        })
    })
  })
  
  
  

});
