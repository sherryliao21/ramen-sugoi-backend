const express = require('express')
const router = express.Router()

const userController = require('../../controllers/userController')

router.get('/:category', userController.getTop10UsersByCategory)

module.exports = router
