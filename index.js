require('dotenv').config()
require('./database')

const express = require('express')
const morgan = require('morgan');
const app = express();
const notFound = require('./middlewares/notFound')
const handleError = require('./middlewares/handleErrors')
const friendsRouter = require('./controllers/friends')

// Middlewares
app.use(morgan('dev'))
app.use(express.json())

// Routes
app.use('/api/friends', friendsRouter)
app.use(notFound)
app.use(handleError)

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})