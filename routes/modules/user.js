const express = require('express')
const router = express.Router()
const userController = require('../../controllers/userController')
const { isAuthenticated, isAdmin } = require('../../middlewares/auth')

router.post('/login', userController.userLogin)
router.get('/profile', userController.getProfile)
router.get('/test', userController.test)

module.exports = router