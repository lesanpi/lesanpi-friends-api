const bcrypt = require('bcrypt')
const usersRouter = require('express').Router()
const User = require('../models/User')

usersRouter.get('/', (request, response) => {
    User.find({}).populate('friends', {
        content: 1,
        date: 1
    }).populate('friendRequestsSent', {
        content: 1,
        date: 1
    }).populate('friendRequestsReceived', {
        content: 1,
        date: 1
    }).then(users => {
        response.json(users)
    }).catch(err => {
        console.log(err)
        next(err)
    })
})

usersRouter.post('/', async (request, response) => {
    const { body } = request
    const { email, name, password } = body

    if (!email) {
        return response.status(400).json({
            error: 'Required "Email" field is missing'
        })
    }

    if (!name) {
        return response.status(400).json({
            error: 'Required "Name" field is missing'
        })
    }

    if (!password) {
        return response.status(400).json({
            error: 'Required "Password" field is missing'
        })
    }

    const saltRounds = 10

    const passwordHash = await bcrypt.hash(password, saltRounds)
    const user = new User({
        email,
        name,
        passwordHash
    })

    const savedUser = await user.save()
    response.json(savedUser)
})

module.exports = usersRouter