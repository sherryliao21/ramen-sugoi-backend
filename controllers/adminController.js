const bcrypt = require('bcryptjs')
const userHelper = require('../models/user')
const restaurantHelper = require('../models/restaurant')
const { errorLogger } = require('../utils/logger')

const createStaff = async (req, res) => {
  try {
    const lastStaff = await userHelper.getLastStaff()
    const staffNumber = parseInt(lastStaff[0].full_name.slice(-1)) + 1
    const baseName = `staff${staffNumber}`
    const salt = await bcrypt.genSalt(10)
    const hash = await bcrypt.hash(baseName, salt)
    const email = `${baseName}@example.com`
    const staffData = {
      email,
      password: hash,
      full_name: baseName,
      roleId: 2,
      description: baseName
    }
    await userHelper.createUser(staffData)
    return res.status(200).send({
      status: 'success',
      message: 'Successfully created a staff!'
    })
  } catch (error) {
    errorLogger.error(`adminController/createStaff: ${error.stack}`)
    return res.status(500).send({
      status: 'error',
      message: 'Unable to create staff'
    })
  }
}

const modifyUserBanStatus = async (req, res) => {
  try {
    const { userId } = req.params
    const isModel = true
    const user = await userHelper.getUserById(userId, isModel)
    user.isBanned = !user.isBanned
    await user.save()
    return res.status(200).send({
      status: 'success',
      message: `Successfully modified. User status is now: ${user.isBanned ? 'banned' : 'active'}`
    })
  } catch (error) {
    errorLogger.error(`adminController/modifyUserBanStatus: ${error.stack}`)
    return res.status(500).send({
      status: 'error',
      message: 'Unable to modify user isBanned status'
    })
  }
}

const getRestaurantByStatus = async (req, res) => {
  try {
    const { status } = req.query
    const restaurants = await restaurantHelper.getRestaurantByStatus(status)
    return res.status(200).send(restaurants)
  } catch (error) {
    errorLogger.error(`adminController/getRestaurantByStatus: ${error.stack}`)
    return res.status(500).send({
      status: 'error',
      message: 'Unable to get restaurant by status'
    })
  }
}

module.exports = {
  createStaff,
  modifyUserBanStatus,
  getRestaurantByStatus
}
