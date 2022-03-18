const User = require('../models/User')
module.exports = async (request, response, next) => {
    const { userId } = request
    try {
        const user = await User.findById(userId)
        console.log({ user })
        next()

    } catch (error) {
        console.log(error)
        return response.status(404).json({ error: 'User not found' })
    }

}