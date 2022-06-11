const express = require('express')
const router = express.Router()
const multer = require('multer')
const upload = multer({ dest: 'uploads/'})
const userController = require('../../controllers/userController')
const { isAuthenticated, isUser } = require('../../middlewares/auth')

router.post('/login', userController.userLogin)
router.post('/register', userController.userRegister)

router.route('/profile')
  .all(isAuthenticated, isUser)
  .get(userController.getProfile)
  .put(userController.editProfile)

router.route('/avatar')
  .all(isAuthenticated, isUser)
  .get(userController.getAvatar)
  .post(upload.single('avatar'), userController.uploadAvatar)
  .delete(userController.deleteAvatar)

module.exports = router