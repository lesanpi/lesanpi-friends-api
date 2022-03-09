module.exports = (request, response, next) => {
    response.status(404).send({ error: 'Not found' })
}