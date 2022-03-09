const bcrypt = require('bcrypt')
const friendsRouter = require('express').Router()
const Friend = require('../models/Friend')

friendsRouter.post('/')