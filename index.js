require('dotenv').config()
require('./database')

const express = require('express')
const morgan = require('morgan');
const app = express();
const Friend = require('./models/Friend')
const User = require('./models/User')
const notFound = require('./middlewares/notFound.js')


// Middlewares
app.use(morgan('dev'))
app.use(express.json())

// Routes
app.get('/api/friends', (request, response) => {

})

app.get('/api/friends/:id', (request, response) => {

})

app.delete('/api/friends/:id', (request, response) => {

})

app.post('/api/friends', (request, response) => {
    const friend = request.body

    if (!friend.name) {
        return response.status(400).json({
            error: 'Required "Name" field is missing'
        })
    }

    if (!friend.email) {
        return response.status(400).json({
            error: 'Required "Email" field is missing'
        })
    }

    const newFriend = new Friend({
        email: friend.email,
        name: friend.name
    })

    newFriend.save().then(saveFriend => {
        response.json(saveFriend)
    }).catch(err => next(err))

})

app.use(notFound)

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})