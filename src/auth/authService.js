const xss = require('xss');
const bcrypt = require('bcryptjs');

const AuthService = {
  validatePassword(password){
    if(password.length < 6){
      return "Password must be at least 6 characters"
    }
  },
  hashPassword(password){
    return bcrypt.hash(password,12);
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
      date_created: new Date(user.date_created),
    }
  }
}

module.exports = AuthService;