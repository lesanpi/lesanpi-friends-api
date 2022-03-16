const supertest = require('supertest')

const { app } = require('../index')
const api = supertest(app)
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

module.exports = {
    initialUsers,
    api,
    getAllUserEmails
}