const friendRequestRouter = require('express').Router()
const User = require('../models/User')
const userExtractor = require('../middlewares/userExtractor')
const { validSendFriendRequest, validDeleteFriendRequest } = require('../middlewares/validFriendRequest')
// const userExists = require('../middlewares/userExists')

friendRequestRouter.post('/:id', userExtractor, validSendFriendRequest, async (request, response, next) => {

    const { userId } = request
    const { id } = request.params

    const user = await User.findById(userId)
    const userRequested = await User.findById(id)

    try {
        const userAtEnd = await User.findByIdAndUpdate(
            user._id,
            { friendRequestsSent: user.friendRequestsSent.concat(userRequested._id) },
            { new: true })

        await User.findByIdAndUpdate(
            userRequested._id,
            { friendRequestsReceived: userRequested.friendRequestsReceived.concat(user._id) },
            { new: true })

        return response.json({
            user: userAtEnd,
            message: "Friend request have been sent"
        })

    } catch (error) {
        next(error)
    }
})

friendRequestRouter.delete('/:id', userExtractor, validDeleteFriendRequest, async (request, response) => {
    const { userId } = request
    const { id } = request.params

    const user = await User.findById(userId)
    const userRequested = await User.findById(id)

    try {
        const userAtEnd = await User.findByIdAndUpdate(
            user._id,
            { friendRequestsSent: user.friendRequestsSent.filter(_userRequested => _userRequested === userRequested._id) },
            { new: true })

        await User.findByIdAndUpdate(
            userRequested._id,
            { friendRequestsReceived: userRequested.friendRequestsReceived.filter(_userRequestor => _userRequestor === user._id) },
            { new: true })

        return response.json({
            user: userAtEnd,
            message: "Friend request have been deleted"
        })
    } catch (error) {
        next(error)
    }
})


module.exports = friendRequestRouter;