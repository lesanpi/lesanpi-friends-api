const User = require('../models/User')

const validSendFriendRequest = async (request, response, next) => {
    const { userId } = request
    const { id } = request.params

    const user = await User.findById(userId)
    const userRequested = await User.findById(id)

    // Verify if the user have already sent the friend request
    const { friendRequestsSent } = user
    const userRequestFound = friendRequestsSent.find(userIdReceived => userIdReceived.toString() === userRequested._id.toString())

    if (userRequestFound) {
        return response.status(400).json({
            error: 'The friend request have been already sent'
        })
    }

    next()

}

const validDeleteFriendRequest = async (request, response, next) => {
    const { userId } = request
    const { id } = request.params

    const user = await User.findById(userId)
    const userRequested = await User.findById(id)

    // Verify that the user request exists
    const { friendRequestsSent } = user
    const userRequestFound = friendRequestsSent.find(userIdReceived =>
        userIdReceived.toString() === userRequested._id.toString())

    if (!userRequestFound) {
        return response.status(400).json({
            error: "The friend request cant be deleted, because doesn't exists"
        })
    }

    next()
}
module.exports = { validSendFriendRequest, validDeleteFriendRequest }