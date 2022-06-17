const express = require('express')
const router = express.Router()
const userController = require('../../controllers/userController')

router.get('/:userId', userController.getUser)
router.get('/:category/top10', userController.getTop10UsersByCategory)

module.exports = router
