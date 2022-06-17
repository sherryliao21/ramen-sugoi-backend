const express = require('express')

const router = express.Router()
const multer = require('multer')

const upload = multer({ dest: 'uploads/' })
const userController = require('../../controllers/userController')
const profileController = require('../../controllers/profileController')
const { isAuthenticated, isUser } = require('../../middlewares/auth')

router.post('/login', userController.userLogin)
router.post('/register', userController.userRegister)

router.put('/password', isAuthenticated, userController.updatePassword)

router.route('/profile').all(isAuthenticated, isUser).get(profileController.getProfile).put(profileController.editProfile)

router
  .route('/avatar')
  .all(isAuthenticated, isUser)
  .post(upload.single('avatar'), profileController.uploadAvatar)
  .delete(profileController.deleteAvatar)

router.get('/:userId/avatar', profileController.getAvatar)

module.exports = router
