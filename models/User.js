const { Schema, model } = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');
const bcrypt = require('bcrypt');

const userSchema = new Schema({
    email: {
        type: String,
        unique: true
    },
    passwordHash: String,
    name: String,
    friends: [{
        type: Schema.Types.ObjectId,
        ref: 'User'
    }],
    friendRequestsSent: [{
        type: Schema.Types.ObjectId,
        ref: 'User'
    }],
    friendRequestsReceived: [{
        type: Schema.Types.ObjectId,
        ref: 'User'
    }],
}, { collection: 'users' })

userSchema.methods.encryptPassword = (password) => {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(10));
}

userSchema.methods.comprePassword = function (password) {
    return bcrypt.compareSync(password, this.password)
}

userSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id
        delete returnedObject._id
        delete returnedObject.__v

        delete returnedObject.passwordHash
    }
})

userSchema.plugin(uniqueValidator)
const User = model('User', userSchema)
module.exports = User