const mongoose = require('mongoose')
const db = process.env.MONGOURI

const connectDB = async () => {
  try {
    await mongoose.connect(db, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
      useFindAndModify: false
    })
    console.log('Database connected!')
  } catch (err) {
    console.log(err.message)
    // exits app
    process.exit(1)
  }
}

module.exports = connectDB