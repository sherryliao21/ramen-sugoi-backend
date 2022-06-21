const express = require('express')
const router = express.Router()
const multer = require('multer')
const upload = multer({ dest: 'uploads/' })
const adminController = require('../../controllers/adminController')
const { isAdmin, isStaff } = require('../../middlewares/auth')

router.post('/staff', isAdmin, adminController.createStaff)
router.post('/ban/:userId', isStaff, adminController.modifyUserBanStatus)
router.get('/restaurants', isStaff, adminController.getRestaurantByStatus)
router.post('/restaurants', isStaff, adminController.createRestaurant)
router.post('/restaurants/:restaurantId/avatar', isStaff, upload.single('restaurant'), adminController.uploadRestaurantAvatar)

module.exports = router