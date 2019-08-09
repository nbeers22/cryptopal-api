const xss = require('xss');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('../config.js');

const AuthService = {
  validatePassword(password){
    if(password.length < 6){
      return "Password must be at least 6 characters"
    }
  },
  hashPassword(password){
    return bcrypt.hash(password,12);
  },
  comparePasswords(password,hash){
    return bcrypt.compare(password,hash);
  },
  createJwt(subject, payload) {
    return jwt.sign(payload, config.JWT_SECRET, {
      subject,
      expiresIn: config.JWT_EXPIRY,
      algorithm: 'HS256',
    })
  },
  checkEmailUnique(db,email){
    return db('cryptopal_users')
      .where({ email })
      .first()
      .then(user => !!user)
  },
  insertUser(db,user){
    return db
      .insert(user)
      .into('cryptopal_users')
      .returning('*')
      .then( ([user]) => user )
  },
  serializeUser(user){
    return {
      id: user.id,
      name: xss(user.name),
      email: xss(user.email),
      date_created: Date.now(),
    }
  },
  getUserByEmail(db,email){
    return db('cryptopal_users')
      .where({ email })
      .first()
  },
  verifyJwt(token) {
    return jwt.verify(token, config.JWT_SECRET, {algorithms: ['HS256']}, (err,decoded) => {
      return err ? err : decoded
    })
  },
}

module.exports = AuthService;