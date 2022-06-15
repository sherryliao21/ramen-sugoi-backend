const express = require('express')

const router = express.Router()
const multer = require('multer')

const userController = require('../../controllers/userController')

router.get('/', userController.getTop10PopularUsers)

module.exports = router
