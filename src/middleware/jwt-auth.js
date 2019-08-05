const AuthService = require('../auth/authService.js')

function requireAuth(req, res, next) {
  const authToken = req.get('Authorization') || ''
  
  let bearerToken
  if (!authToken.toLowerCase().startsWith('bearer ')) {
    return res.status(401).json({ error: 'Missing bearer token' })
  } else {
    bearerToken = authToken.slice(7, authToken.length)
  }

  try {
    const payload = AuthService.verifyJwt(bearerToken);
    if(payload.message.includes("expired")){
      return res
        .status(401)
        .json({
          error: 'Token Expired'
        })
    }

    AuthService.getUserByEmail(
      req.app.get('db'),
      payload.sub,
    )
      .then(user => {
        if (!user){
          return res.status(401).json({ error: 'Unauthorized request' })
        }
        req.user_id = user.id;
        next()
      })
      .catch(err => {
        console.error(err)
        next(err)
      })
    
  } catch(error) {
    return res.status(401).json({ error })
  }
}

module.exports = {
  requireAuth,
}