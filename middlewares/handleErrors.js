module.exports = (error, request, response, next) => {
    if (error.name === 'CastError') {
        response.status(400).send({ error: 'id user is malformed' })
    } else {
        console.log(error.name)
        console.error(error)
        response.status(500).send({ error: 'An error occurred' })
    }
}