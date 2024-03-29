const express = require('express')

const router = express.Router()
const baseURL = '/api/v1'
const user = require('./modules/user')
const users = require('./modules/users')
const following = require('./modules/following')
const favorite = require('./modules/favorite')
const rating = require('./modules/rating')
const comments = require('./modules/comments')
const restaurants = require('./modules/restaurants')
const admin = require('./modules/admin')
const { isAuthenticated, isUser, isNotBanned, isStaff } = require('../middlewares/auth')

router.use(`${baseURL}/user`, user)
router.use(`${baseURL}/users`, isAuthenticated, isUser, users)
router.use(`${baseURL}/following`, isAuthenticated, isUser, following)
router.use(`${baseURL}/favorite`, isAuthenticated, isUser, favorite)
router.use(`${baseURL}/rating`, isAuthenticated, isUser, rating)
router.use(`${baseURL}/comments`, isAuthenticated, isUser, isNotBanned, comments)
router.use(`${baseURL}/restaurants`, isAuthenticated, isUser, restaurants)
router.use(`${baseURL}/admin`, isAuthenticated, isStaff, admin)

module.exports = router
