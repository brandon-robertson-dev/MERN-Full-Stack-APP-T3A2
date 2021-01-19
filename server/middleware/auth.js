const jwt = require('jsonwebtoken')
const jwtToken = process.env.JWTSECRET
module.exports = function(req, res, next) {
  const currentToken = req.header('x-auth-token')
  if(!currentToken) {
    return res.status(401).json({ msg: 'Not authorized' })
  }
  try {
    const decoded = jwt.verify(currentToken, `${jwtToken}`)
    req.user = decoded.user
    next()
  } catch(err) {
    res.status(401).json({ msg: 'Token is not valid or expired' })
  }
}