const express = require('express')
const connectDB = require('./config/db')
const userRoutes = require('./routes/api/users')
const authRoutes = require('./routes/api/auth')
const profileRoutes = require('./routes/api/profile')
const postRoutes = require('./routes/api/posts')

const app = express()

connectDB()

app.use(express.json({ extended: false }))

app.get('/', (req, res) => res.send('API Running'))

app.use('/users', userRoutes)
app.use('/auth', authRoutes)
app.use('/profile', profileRoutes)
app.use('/posts', postRoutes)

const port = process.env.port || 3000

app.listen(port, () => console.log(`Server started on http://localhost:${port}`))