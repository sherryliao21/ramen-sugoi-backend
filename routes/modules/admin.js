const express = require('express')
const router = express.Router()
const adminController = require('../../controllers/adminController')
const { isAdmin, isStaff } = require('../../middlewares/auth')

router.post('/staff', isAdmin, adminController.createStaff)

module.exports = router
