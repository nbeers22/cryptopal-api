const express = require('express');
const path = require('path');
const gravatar = require('gravatar');

const authRouter = express.Router();
const jsonParser = express.json();

const AuthService = require('./authService.js')

authRouter
  .post( '/login', jsonParser, (req, res, next) => {
    const { email, password } = req.body;
    const user = { email, password };
    let hashedPW;
    
    for( const [key,value] of Object.entries(user)){
      if(value == null){
        return res.status(400).json({
          error: `Missing ${key} in request`
        })
      }
    }

    AuthService.getUserByEmail(req.app.get('db'),user.email)
      .then( user => {
        if(!user){
          return res.status(400).json({
            error: "No account found with that email"
          })
        }

        AuthService.comparePasswords(password,user.password)
          .then(passwordsMatch => {
            if(!passwordsMatch){
              return res.status(400).json({
                error: "Incorrect email and/or password"
              })
            }
            const subject = user.email;
            const payload = { user_id: user.id }
            const gravatarURL = gravatar.url(user.email);
            
            res.send({
              authToken: AuthService.createJwt(subject,payload),
              user_id: user.id,
              name: user.name,
              gravatar: gravatarURL
            })
          })
      })
      .catch(next)
  });

authRouter
  .post( '/signup', jsonParser, (req, res, next) => {
    const { name, email, password } = req.body;
    const newUser = { name, email, password };
    
    for(const field of ['name', 'email', 'password']){
      if(!req.body[field]){
        return res.status(400).json({
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
            return AuthService.insertUser(req.app.get('db'),newUser)
              .then( user => {
                res.
                  status(201)
                  .location(path.posix.join(req.originalUrl, `/${user.id}`))
                  .json(AuthService.serializeUser(user))
              })
          })
      })
      .catch(next)
  });

  module.exports = authRouter;