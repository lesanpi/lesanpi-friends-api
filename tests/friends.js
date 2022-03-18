// const moongose = require('mongoose')

// // const { app, server } = require('../index')
// const User = require('../models/User')
// const { initialUsers, api, getAllUserEmails, getToken, getUsers } = require('./helpers')

// describe('Friends', () => {

//     beforeEach(async () => {
//         await User.deleteMany({})
//         for (const user of initialUsers) {
//             await api.post('/api/users')
//                 .send(user)
//         }

//     })
    

//     afterAll(() => {
//         moongose.connection.close()
//     })
// })