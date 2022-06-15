const express = require('express')

const router = express.Router()
const multer = require('multer')

const userController = require('../../controllers/userController')
const { isAuthenticated, isUser } = require('../../middlewares/auth')

router.get('/', userController.getTopUsers)

module.exports = router
