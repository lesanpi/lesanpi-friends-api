const friendAcceptRouter = require('express').Router()
const User = require('../models/User')
const userExtractor = require('../middlewares/userExtractor')

friendAcceptRouter.post('/:id', userExtractor, async (request, response, next) => {

    const { userId } = request
    const { id } = request.params

    const user = await User.findById(userId)
    const userRequestor = await User.findById(id)

    try {
        const userAtEnd = await User.findByIdAndUpdate(
            user._id,
            {
                friends: user.friends.concat(userRequestor._id),
                friendRequestsReceived: user.friendRequestsReceived.filter(_userRequestor => _userRequestor === userRequestor._id)
            },
            { new: true })

        await User.findByIdAndUpdate(
            userRequestor._id,
            {
                friends: userRequestor.friends.concat(user._id),
                friendRequestsSent: userRequestor.friendRequestsSent.filter(_userRequested => _userRequested === user._id),
            },
            { new: true })

        return response.json({
            user: userAtEnd,
            message: "Friend request have been accepted"
        })

    } catch (error) {
        console.error(error)
        next(error)
    }
})

friendAcceptRouter.delete('/:id', userExtractor, async (request, response) => {
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


module.exports = friendAcceptRouter