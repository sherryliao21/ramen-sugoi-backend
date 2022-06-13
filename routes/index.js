const express = require('express')

const router = express.Router()
const baseURL = '/api/v1'
const user = require('./modules/user')
const users = require('./modules/users')
const following = require('./modules/following')

router.use(`${baseURL}/user`, user)
router.use(`${baseURL}/users`, users)
router.use(`${baseURL}/following`, following)

module.exports = router
