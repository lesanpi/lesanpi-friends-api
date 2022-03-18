require('dotenv').config()
require('./database')

const express = require('express')
const morgan = require('morgan');
const app = express();
const notFound = require('./middlewares/notFound')
const handleError = require('./middlewares/handleErrors')
const loginRouter = require('./controllers/login')
const usersRouter = require('./controllers/users')
const friendRequestRouter = require('./controllers/friendRequest')
const friendAcceptRouter = require('./controllers/friendAccept')

// Middlewares
app.use(morgan('dev'))
app.use(express.json())

// Routes
app.use('/api/friends/request', friendRequestRouter)
app.use('/api/friends/accept', friendAcceptRouter)
app.use('/api/users', usersRouter)
app.use('/api/login', loginRouter)
app.use(notFound)
app.use(handleError)

const PORT = process.env.PORT || 3001
const server = app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})

module.exports = { app, server }