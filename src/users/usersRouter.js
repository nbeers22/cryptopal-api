require('dotenv').config();
const express = require('express');

const usersRouter = express.Router()
const jsonParser = express.json()

const UsersService = require('./usersService.js')
const { requireAuth } = require('../middleware/jwt-auth.js')

usersRouter
  .route('/:user_id/favorites')
  .get( (req, res, next) => {
    res.send('Hello')
    // const { user_id } = req.params;

    // UsersService.getUserByID(req.app.get('db', user_id))
    //   .then( user => {
    //     if(user){
    //       res.status(200).json({
    //         favorites: response.favorites
    //       })
    //     }else{
    //       console.log('Error: User does not exist')
    //     }
    //   })
  })

usersRouter
  .route('/favorites')
  .patch(requireAuth, jsonParser, (req,res,next) => {
    const db = req.app.get('db');
    const { coinID } = req.body;
    const { user_id } = req;
    console.log(res.headersSent) // FALSE
    
    // get current favorites for user to see if it already exists in db
    UsersService.getUserFavorites(db, user_id)
      .then( response => {
        console.log(res.headersSent) // TRUE
        let favExists = false;
        response.favorites.forEach( fav => {
          if(fav == coinID)
            favExists = true;
        })
        if(favExists){
          return res.status(401).json({ error: "Coin already exists in favorites" })
        }else{
          UsersService.addToUserFavorites(db, user_id, coinID)
            .then( response => {
              res.status(204).json({ response })
            })
        }
      })
  });

  module.exports = usersRouter;
