const express = require('express')

const router = express.Router()
const baseURL = '/api/v1'
const user = require('./modules/user')
const users = require('./modules/users')
const following = require('./modules/following')
const favorite = require('./modules/favorite')
const restaurants = require('./modules/restaurants')

router.use(`${baseURL}/user`, user)
router.use(`${baseURL}/users`, users)
router.use(`${baseURL}/following`, following)
router.use(`${baseURL}/favorite`, favorite)
router.use(`${baseURL}/restaurants`, restaurants)

module.exports = router
