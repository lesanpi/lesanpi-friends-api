const bcrypt = require('bcrypt')
const friendsRouter = require('express').Router()
const Friend = require('../models/Friend')


friendsRouter.get('/', (request, response) => {
    Friend.find({})
        .then(friends => {
            response.json(friends)
        })
        .catch(err => next(err))
})

friendsRouter.get('/:id', (request, response, next) => {
    const { id } = request.params;
    Friend.findById(id)
        .then(friend => {
            if (friend) return response.json(friend)
            response.status(404).send({ error: `Friend with id ${id} not found` })
        })
        .catch(err => next(err))

})

friendsRouter.delete('/:id', (request, response) => {
    const { id } = request.params
    Friend.findByIdAndDelete(id)
        .then(result => {
            response.json({ message: "Friend deleted succesfully" })
        })
        .catch(err => next(err))
})

friendsRouter.put('/:id', (request, response, next) => {
    const { id } = request.params
    const friend = request.body

    const newFriendInfo = {
        email: friend.email,
        name: friend.name
    }

    Friend.findByIdAndUpdate(id, newFriendInfo, { new: true })
        .then(result => {
            response.json(result)
        })
        .catch(next)
})

friendsRouter.post('/', (request, response) => {
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

module.exports = friendsRouter;