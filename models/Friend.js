const { Schema, model } = require('mongoose');

const friendSchema = new Schema({
    email: String,
    name: String
}, { collection: 'friends' })

friendSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id
        delete returnedObject._id
        delete returnedObject.__v
    }
})

const Friend = model('Friend', friendSchema)
module.exports = Friend 