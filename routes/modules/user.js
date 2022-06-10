const express = require('express')
const router = express.Router()
const userController = require('../../controllers/userController')
const { isAuthenticated, isUser } = require('../../middlewares/auth')

router.post('/login', userController.userLogin)
router.route('/profile')
  .all(isAuthenticated, isUser)
  .get(userController.getProfile)
  .put(userController.editProfile)

router.get('/test', userController.test)

module.exports = router