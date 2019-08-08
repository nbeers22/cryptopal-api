const bcrypt = require('bcryptjs');

function makeUsersArray() {
  return [
    {
      id: 1,
      email: 'user1@mail.com',
      name: 'TU1',
      password: 'password',
      favorites: [1,2,22],
      date_created: '2029-01-22T16:28:32.615Z',
    },
    {
      id: 2,
      email: 'user2@mail.com',
      name: 'TU2',
      password: 'password',
      favorites: [1,2,33],
      date_created: '2029-01-22T16:28:32.615Z',
    },
    {
      id: 3,
      email: 'user3@mail.com',
      name: 'TU3',
      password: 'password',
      favorites: [1,2,44],
      date_created: '2029-01-22T16:28:32.615Z',
    },
    {
      id: 4,
      email: 'user4@mail.com',
      name: 'TU4',
      password: 'password',
      favorites: [1,2,11],
      date_created: '2029-01-22T16:28:32.615Z',
    },
  ]
}

function cleanTables(db) {
  return db.raw(
    `TRUNCATE
      cryptopal_users
      RESTART IDENTITY CASCADE`
  )
}

function seedUsers(db,users){
  const preppedUsers = users.map( user => {
    return {
      ...user,
      password: bcrypt.hashSync(user.password, 1)
    }
  return db.into('cryptopal_users').insert(preppedUsers)
    .then( () =>
      // update auto-sequence to stay in sync
      db.raw(
        `SELECT setval('cryptopal_users_seq', ?)`,
        [users[users.length - 1].id]
      )
    )
  })
}

const createJwt = (subject, payload) => {
  return jwt.sign(payload, process.env.JWT_SECRET, {
    subject,
    expiresIn: process.env.JWT_EXPIRY,
    algorithm: 'HS256',
  })
}

const verifyJwt = token => {
  return jwt.verify(token, process.env.JWT_SECRET, {algorithms: ['HS256']}, (err,decoded) => {
    return err ? err : decoded
  })
}

module.exports = {
  makeUsersArray,
  cleanTables,
  seedUsers,
  createJwt,
  verifyJwt
}
