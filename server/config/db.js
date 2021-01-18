const mongoose = require('mongoose')
const user = process.env.MONGOUSER
const pass = process.env.MONGOPASS

const connectDB = async () => {
  try {
    await mongoose.connect(`mongodb+srv://${user}:${pass}@cluster0.5mwan.mongodb.net/socialmedia?retryWrites=true&w=majority`, {
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