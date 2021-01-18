require('dotenv').config()
const express = require('express')
const connectDB = require('./config/db')
const userRoutes = require('./routes/api/users')
const authRoutes = require('./routes/api/auth')
const profileRoutes = require('./routes/api/profile')
const postRoutes = require('./routes/api/posts')
const path = require('path')

const app = express()

connectDB()

app.use(express.json({ extended: false }))

app.use('/api/users', userRoutes)
app.use('/api/auth', authRoutes)
app.use('/api/profile', profileRoutes)
app.use('/api/posts', postRoutes)

if (process.env.NODE_ENV === 'production') {
  app.use(express.static('client/build'))
  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'))
  })
}

const PORT = process.env.PORT || 5000

app.listen(PORT, () => console.log(`Server started on http://localhost:${PORT}`))