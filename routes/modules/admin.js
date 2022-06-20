const express = require('express')
const router = express.Router()
const adminController = require('../../controllers/adminController')
const { isAdmin, isStaff } = require('../../middlewares/auth')

router.post('/staff', isAdmin, adminController.createStaff)
router.post('/ban/:userId', isStaff, adminController.modifyUserBanStatus)
router.get('/restaurants', isStaff, adminController.getRestaurantByStatus)

module.exports = router
