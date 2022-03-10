const mongoose = require('mongoose');

mongoose.connect(process.env.DB_URI, { dbName: 'lesanpifriends' })
    .then(db => console.log('Database connected.'))
    .catch(err => console.log('Error connecting with the Database\n', err))


process.on('uncaughtException', () => {
    mongoose.disconnect();
})