const express = require('express');

const authRouter = express.Router();
const jsonParser = express.json();
const path = require('path');

const AuthService = require('./authService.js')

authRouter
  .post( '/login', jsonParser, (req, res, next) => {
    const { email, password } = req.body;
    const user = { email, password };
    // FINISH THIS PART
  });

authRouter
  .post( '/signup', jsonParser, (req, res, next) => {
    const { name, email, password } = req.body;
    const newUser = { name, email, password };

    for(const field of ['name', 'email', 'password']){
      if(!req.body[field]){
        res.status(400).json({
          error: `Missing ${field} in request body`
        });
      }
    }

    const passwordError = AuthService.validatePassword(password);

    if(passwordError){
      return res.status(400).json({ error: passwordError });
    }

    AuthService.checkEmailUnique(req.app.get('db'),email)
      .then( response => {
        if(response){
          return res.status(400).json({ error: `Email already taken` })
        }
        AuthService.hashPassword(password)
          .then( hashedPassword => {
            const newUser = {
              name,
              email,
              password: hashedPassword
            }
          })
        return AuthService.insertUser(req.app.get('db'),newUser)
          .then( user => {
            res.
              status(201)
              .location(path.posix.join(req.originalUrl, `/${user.id}`))
              .json(AuthService.serializeUser(user))
          })
      })
      .catch(next)
  });

  module.exports = authRouter;