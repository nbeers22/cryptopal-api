const xss = require('xss');
const config = require('../config.js');

const UsersService = {
  getUserByID(db,id){
    return db('cryptopal_users')
      .where({ id })
      .first()
  },
  addToUserFavorites(db,id,favorites){
    return db('cryptopal_users')
      .where('id', id)
      .update({
        favorites: db.raw('array_append(favorites, ?)', [favorites])
      })
  },
  removeFromUserFavorites(db,id,favorite){
    return db('cryptopal_users')
      .where('id', id)
      .update({
        favorites: db.raw('array_remove(favorites, ?)', [favorite])
      })
  },
  updateUserName(db, id, data){
    return db('cryptopal_users')
      .where('id', id)
      .update({
        name: data.name
      })
      .returning('*')
  },
  updateUserPW(db, id, data){
    return db('cryptopal_users')
      .where('id', id)
      .update({
        password: data.password
      })
      .returning('*')
  }
}

module.exports = UsersService;