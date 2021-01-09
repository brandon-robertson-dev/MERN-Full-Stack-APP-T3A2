const {

} = require('../utilities/auth_utilities')

async function login(req, res) {
  try {
    const user = await User.findById(req.user.id).select('-password')
    res.json(user)
  } catch(err) {
    console.log(err.message)
    res.status(500).send('Service error')
  }
}

module.exports = {
  login,

}