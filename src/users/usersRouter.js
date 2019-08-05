require('dotenv').config();
const express = require('express');

const usersRouter = express.Router()
const jsonParser = express.json()

const UsersService = require('./usersService.js')
const { requireAuth } = require('../middleware/jwt-auth.js')

usersRouter
  .route('/:user_id/favorites')
  .get( (req, res, next) => {
    const { user_id } = req.params;
    
    UsersService.getUserByID(req.app.get('db'), user_id)
      .then( user => {
        if(user){
          res.status(200).json({
            favorites: user.favorites
          })
        }else{
          res.status(404).json({
            error: `User with id: ${user_id} not found`
          })
        }
      })
  })

usersRouter
  .route('/favorites')
  .patch(requireAuth, jsonParser, (req,res,next) => {
    const db = req.app.get('db');
    const { coinID } = req.body;
    const { user_id } = req;
    
    // get current favorites for user to see if it already exists in db
    UsersService.getUserByID(db, user_id)
      .then( response => {
        let favExists = false;
        if(response.favorites){
          response.favorites.forEach( fav => {
            if(fav == coinID)
              favExists = true;
          })
        }
        if(favExists){
          return res.status(401).json({ error: "Coin already exists in favorites" })
        }else{
          UsersService.addToUserFavorites(db, user_id, coinID)
            .then( response => {
              res.status(204).json({ response })
            })
        }
      })
  })
  .put(requireAuth, jsonParser, (req,res,next) => {
    const db = req.app.get('db');
    const { coinID } = req.body;
    const { user_id } = req;

    if(!user_id || !coinID){
      return res.status(401).json({ error: "Unauthorized request" })
    }
    
    UsersService.removeFromUserFavorites(db, user_id, coinID)
      .then( response => {
        res.status(204).json({ response })
      })
      .catch( err => next(err))
  });

  module.exports = usersRouter;
