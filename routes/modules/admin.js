const express = require('express')
const router = express.Router()
const multer = require('multer')
const upload = multer({ dest: 'uploads/' })
const adminController = require('../../controllers/adminController')
const { isAdmin, isStaff } = require('../../middlewares/auth')

router.post('/staff', isAdmin, adminController.createStaff)
router.post('/ban/:userId', isStaff, adminController.modifyUserBanStatus)
router.route('/restaurants').all(isStaff).get(adminController.getRestaurantByStatus).post(adminController.createRestaurant)
router
  .route('/restaurants/:restaurantId/avatar')
  .all(isStaff)
  .post(upload.single('restaurant'), adminController.uploadRestaurantAvatar)
  .delete(adminController.deleteRestaurantAvatar)

router.put('/restaurants/:restaurantId', isStaff, adminController.editRestaurant)
router.put('/restaurants/:restaurantId/status', isStaff, adminController.editRestaurantStatus)

router.get('/users', isStaff, adminController.getUsers)
router.get('/comments', isStaff, adminController.getComments)

module.exports = router