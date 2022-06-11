const express = require('express')
const router = express.Router()
const multer = require('multer')
const upload = multer({ dest: 'uploads/'})
const userController = require('../../controllers/userController')
const { isAuthenticated, isUser } = require('../../middlewares/auth')

router.post('/login', userController.userLogin)
router.route('/profile')
  .all(isAuthenticated, isUser)
  .get(userController.getProfile)
  .put(userController.editProfile)

router.route('/avatar')
  .all(isAuthenticated, isUser)
  .post(upload.single('avatar'), userController.uploadAvatar)
  .get(userController.getAvatar)

module.exports = router