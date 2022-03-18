const jwt = require('jsonwebtoken')

module.exports = (request, response, next) => {
    const authorization = request.get('authorization')
    let token = ''

    if (authorization && authorization.toLowerCase().startsWith('bearer')) {
        token = authorization.substring(7)
    } else {
        return response.status(401).json({ error: 'Token missing or invalid' })
    }

    const decodedToken = jwt.verify(token, process.env.SECRET_KEY)
    if (!token || !decodedToken.id) {
        return response.status(401).json({ error: 'Token missing or invalid' })
    }

    const { id: userId } = decodedToken

    request.userId = userId
    next()
}