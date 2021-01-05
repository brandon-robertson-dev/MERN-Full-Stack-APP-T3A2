const express = require('express')
const connectDB = require('./config/db')

const app = express()

connectDB()

app.use(express.json({ extended: false }))

app.get('/', (req, res) => res.send('API Running'))

app.use('/users', require('./routes/api/users'))
app.use('/auth', require('./routes/api/auth'))
app.use('/profile', require('./routes/api/profile'))
app.use('/posts', require('./routes/api/posts'))

const port = process.env.port || 3000

app.listen(port, () => console.log(`Server started on http://localhost:${port}`))