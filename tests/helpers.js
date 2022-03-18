const supertest = require('supertest')

const { app } = require('../index')
const api = supertest(app)
const User = require('../models/User')

const initialUsers = [
    {
        "email": "ana@lesanpi.com", "name": "ana patricia", "password": "anita"
    },
    {
        "email": "lesanpi@lesanpi.com", "name": "luis", "password": "luisito"
    }
]

const getAllUserEmails = async () => {
    const response = await api.get('/api/users')
    return { emails: response.body.map(user => user.email), response }

}


const getUsers = async () => {
    const usersDB = await User.find({})
    return usersDB.map(user => user.toJSON())
}

const getUserByEmail = async (email) => {
    const allUsers = await getUsers()
    const userRequested = allUsers.find(_user => _user.email === email)
    return userRequested
}
const getToken = async (user) => {
    const { email, password } = user

    const response = await api
        .post('/api/login')
        .send({ email, password })

    const { token } = response.body
    return { token, response }
}
module.exports = {
    initialUsers,
    api,
    getAllUserEmails,
    getToken,
    getUsers,
    getUserByEmail
}