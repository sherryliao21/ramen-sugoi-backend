const express = require('express')
const router = express.Router()
const baseURL = '/api/v1'
const user = require('./modules/user')

router.use(`${baseURL}/user`, user)

module.exports = router