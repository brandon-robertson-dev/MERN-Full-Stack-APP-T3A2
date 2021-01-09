const {

} = require('../utilities/users_utilities')

async function registerUserToDatabase(req, res) {
  const errors = validationResult(req)
  if(!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() })
  }

  const { firstname, lastname, email, password } = req.body

  try {
    
  } catch(err) {
    console.log(err.message)
    res.status(500).send('Server error')
  }
}

module.exports = {
  registerUserToDatabase
}