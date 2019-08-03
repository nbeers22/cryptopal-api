const xss = require('xss');
const config = require('../config.js');

const UsersService = {
  getUserByID(db,id){
    return db('cryptopal_users')
      .where({ id })
      .first()
  },
  getUserFavorites(db,id){
    return db('cryptopal_users')
      .where('id', id)
      .first()
  },
  addToUserFavorites(db,id,favorites){
    return db('cryptopal_users')
      .where('id', id)
      .update({
        favorites: db.raw('array_append(favorites, ?)', [favorites])
      })
  },
}

module.exports = UsersService;