const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const loginRouter = require('express').Router()
const User = require('../models/User')

loginRouter.post('/', async (request, response) => {
    const { body } = request
    const { email, password } = body
    const user = await User.findOne({ email })

    const samePassword = await bcrypt.compare(password, user.passwordHash)
    console.log(samePassword)
    const passwordCorrect = user === null ? false : samePassword

    if (!(user && passwordCorrect)) {
        return response.status(401).json({
            error: 'Invalid user or password'
        })
    }

    const userForToken = {
        id: user._id,
        email: user.email
    }

    const token = jwt.sign(userForToken, process.env.SECRET_KEY)

    return response.send({
        name: user.name,
        email: user.email,
        token
    })
})


module.exports = loginRouter