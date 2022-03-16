const { server } = require('../index')
const mongoose = require('mongoose')

const User = require('../models/User')
const { initialUsers, api, getAllUserEmails } = require('./helpers')

beforeEach(async () => {
    await User.deleteMany({})

    for (const user of initialUsers) {
        const newUser = new User(user)
        await newUser.save()
    }

})

describe('Users', () => {

    test('Users are returned as json', async () => {
        await api
            .get('/api/users')
            .expect(200)
            .expect('Content-Type', /application\/json/)
    })

    test('There are two users', async () => {
        const response = await api.get('/api/users')
        expect(response.body).toHaveLength(initialUsers.length)
    })

    test('The first user is Ana', async () => {
        const { emails } = await getAllUserEmails()

        expect(emails).toContain(initialUsers[0].email)
    })

    test('A valid new user can be registered', async () => {
        const newUser = {
            "email": "ana2@lesanpi.com", "name": "ana patricia", "password": "anita"
        }

        await api
            .post('/api/users')
            .send(newUser)
            .expect(200)
            .expect('Content-Type', /application\/json/)

        const { emails, response } = await getAllUserEmails()
        expect(response.body).toHaveLength(initialUsers.length + 1)
        expect(emails).toContain(newUser.email)
    })

    test('A new user without email cant be registered', async () => {
        const newUser = {
            "name": "ana patricia", "password": "anita"
        }

        await api
            .post('/api/users')
            .send(newUser)
            .expect(400)

        const { emails, response } = await getAllUserEmails()

        expect(response.body).toHaveLength(initialUsers.length)
        expect(emails).not.toContain(newUser.email)
    })
})

afterAll(() => {
    mongoose.connection.close()
    server.close()
})