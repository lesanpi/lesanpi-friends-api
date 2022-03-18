const ERROR_HANDLERS = {
    CastError: res => res.status(400).send({ error: 'Id User is malformed' }),
    JsonWebTokenError: res => res.status(401).json({ error: 'Token missing or invalid' }),
    TokenExpirerError: res => res.status(401).json({ error: 'Token expired' }),
    defaultError: res => res.status(500).send({ error: 'An error occurred' })
}

module.exports = (error, request, response, next) => {
    console.error(error.name)
    const handler = ERROR_HANDLERS[error.name] || ERROR_HANDLERS.defaultError
    handler(response)
}