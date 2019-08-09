const knex = require('knex')
const app = require('../src/app')
const helpers = require('./test-helpers')
const jwt = require('jsonwebtoken');
const gravatar = require('gravatar');
const bcrypt = require('bcryptjs');
const xss = require('xss');

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
          error: `No account found with that email`
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

    it(`responds 200 and JWT auth token using secret when valid credentials`, () => {
      const userValidCreds = {
        email: testUser.email,
        password: testUser.password,
      }
      const expectedToken = jwt.sign(
        { user_id: testUser.id },
        process.env.JWT_SECRET,
        {
          subject: testUser.email,
          expiresIn: '24h',
          algorithm: 'HS256',
        }
      )
      const gravatarURL = gravatar.url(testUser.email);

      return supertest(app)
        .post('/api/auth/login')
        .send(userValidCreds)
        .expect(200, {
          authToken: expectedToken,
          user_id: testUser.id,
          name: testUser.name,
          gravatar: gravatarURL
        })
    })
  })
  
  describe.only('POST /api/auth/signup', () => {
    const requiredFields = ['email', 'password', 'name'];

    requiredFields.forEach( field => {
      const signupAttemptBody = {
        email: testUser.email,
        password: testUser.password,
        name: testUser.name,
      }

      it(`responds with 400 required error when ${field} is missing`, () => {
        delete signupAttemptBody[field]

        return supertest(app)
          .post("/api/auth/signup")
          .send(signupAttemptBody)
          .expect(400, {
            error: `Missing ${field} in request body`
          })
      })
    });

    it('responds with 400 error when password is less than 6 characters', () => {
      const signupAttemptBody = {
        email: testUser.email,
        password: "hello",
        name: testUser.name,
      }

      return supertest(app)
        .post('/api/auth/signup')
        .send(signupAttemptBody)
        .expect(400, {
          error: "Password must be at least 6 characters"
        })
    });

    it('responds with 400 error when email is not unique', () => {
      helpers.seedUsers( db, testUsers)

      const signupAttemptBody = {
        email: testUser.email,
        password: testUser.password,
        name: testUser.name,
      }

      return supertest(app)
        .post('/api/auth/signup')
        .send(signupAttemptBody)
        .expect(400, {
          error: "Email already taken"
        })
    })

    context('Successful sign up', () => {
      it('responds with 201 created when all validations pass', () => {
        const signupAttemptBody = {
          email: testUser.email,
          password: testUser.password,
          name: testUser.name,
        }
  
        return supertest(app)
          .post('/api/auth/signup')
          .send(signupAttemptBody)
          .expect(201)
          .expect( res => {
            expect(res.body.id).to.eql(testUser.id)
            expect(res.body.email).to.eql(testUser.email)
            expect(res.body.name).to.eql(testUser.name)
            expect(res.body).to.not.have.property('password')
            expect(res.headers.location).to.eql(`/api/auth/signup/${res.body.id}`)
            const expectedDate = new Date().toLocaleString('en', { timeZone: 'UTC' })
            const actualDate = new Date(res.body.date_created).toLocaleString()
            expect(actualDate).to.eql(expectedDate)
          })
      })
      
      it('Properly inserts new user into database', () => {
        const signupAttemptBody = {
          email: testUser.email,
          password: testUser.password,
          name: testUser.name,
        }
  
        return supertest(app)
          .post('/api/auth/signup')
          .send(signupAttemptBody)
          .expect(201)
          .expect(res =>
            db 
              .from('cryptopal_users')
              .select('*')
              .where({ id: res.body.id })
              .first()
              .then( row => {
                expect(row.email).to.eql(testUser.email)
                expect(row.id).to.eql(testUser.id)
                expect(row.name).to.eql(testUser.name)
                const expectedDate = new Date().toLocaleString('en', { timeZone: 'UTC' })
                const actualDate = new Date(row.date_created).toLocaleString()
                // expect(actualDate).to.eql(expectedDate)

                return bcrypt.compare(testUser.password, row.password)
              })
              .then( passwordsMatch => {
                expect(passwordsMatch).to.be.true
              })
          )
      })
    })
  })
  

});
