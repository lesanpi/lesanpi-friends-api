const mongoose = require('mongoose');

const { MONGO_DB_URI, MONGO_DB_URI_TEST, NODE_ENV } = process.env
const connectionString = NODE_ENV === 'test' ? MONGO_DB_URI_TEST : MONGO_DB_URI

if (!connectionString) {
    console.error("Usa el archivo .env para indicar el MONGO_DB_URI")
}

mongoose.connect(connectionString, { dbName: 'lesanpifriends' })
    .then(db => {
        // console.log('Database connected.')
    })
    .catch(err => console.log('Error connecting with the Database\n', err))


process.on('uncaughtException', error => {
    console.error(error)
    mongoose.disconnect();
})