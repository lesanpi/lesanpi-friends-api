const moongose = require('mongoose')
const { get } = require('superagent')

const { server } = require('../index')

const User = require('../models/User')
const { initialUsers, api, getAllUserEmails, getToken, getUsers, getUserByEmail } = require('./helpers')


describe('Users', () => {

    beforeEach(async () => {
        await User.deleteMany({})

        for (const user of initialUsers) {
            await api.post('/api/users')
                .send(user)
        }

    })

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

    test('A new user with a email already registered', async () => {
        const newUser = initialUsers[0]
        await api
            .post('/api/users')
            .send(newUser)
            .expect(400)

        const { emails, response } = await getAllUserEmails()

        expect(emails)
            .toHaveLength(initialUsers.length)

    })

    test('A correct login with Luis user', async () => {


        const user = initialUsers[1]
        const { token } = await getToken(user)
        expect(token)
    })

    test('A incorrect login with Luis user', async () => {


        const user = {
            email: initialUsers[1].email,
            password: 'asdkmasdj'
        }

        const { response } = await getToken(user)
        const error = response.body.error

        expect(response.statusCode).toBe(401)
        expect(error).toBe('Invalid user or password')
    })

    test('Send a friend request from Luis to Ana', async () => {
        const user = initialUsers[1]
        const emailRequested = initialUsers[0].email
        const { token } = await getToken(user)

        const userRequested = await getUserByEmail(emailRequested)
        const response = await api.post(`/api/friends/request/${userRequested.id.toString()}`).set('Authorization', `Bearer ${token}`)
        expect(response.body.message).toBe("Friend request have been sent")
    })

    test('Send two friend request to the same person ', async () => {
        const user = initialUsers[1]
        const emailRequested = initialUsers[0].email
        const { token } = await getToken(user)

        const userRequested = await getUserByEmail(emailRequested)
        const response = await api.post(`/api/friends/request/${userRequested.id.toString()}`).set('Authorization', `Bearer ${token}`)
        expect(response.body.message).toBe("Friend request have been sent")


        const response2 = await api.post(`/api/friends/request/${userRequested.id.toString()}`).set('Authorization', `Bearer ${token}`)
        expect(response2.body.error).toBe('The friend request have been already sent')

    })

    afterAll(() => {
        moongose.connection.close()
        server.close()
    })
})

