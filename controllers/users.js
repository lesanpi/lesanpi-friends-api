const bcrypt = require('bcrypt')
const usersRouter = require('express').Router()
const User = require('../models/User')

usersRouter.get('/', async (request, response) => {
    try {
        const users = await User.find({})
            .populate('friends', {
                email: 1,
                name: 1,
                friends: 1
            })
            .populate('friendRequestsSent', {
                email: 1,
                name: 1,
                friends: 1
            })
            .populate('friendRequestsReceived', {
                email: 1,
                name: 1,
                friends: 1
            })

        response.json(users)
    } catch (error) {
        console.error(error)
        next(error)
    }
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

    user.save()
        .then(
            savedUser => response.json(savedUser)
        ).catch(
            err => {
                console.log(err)
                response.status(400).json({
                    error: 'User already registered'
                })
            }
        )

})

module.exports = usersRouter