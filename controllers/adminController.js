const bcrypt = require('bcryptjs')
const util = require('util')
const fs = require('fs')
const userHelper = require('../models/user')
const restaurantHelper = require('../models/restaurant')
const s3ObjectStore  = require('../service/s3')
const { errorLogger, warningLogger } = require('../utils/logger')

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

const createRestaurant = async (req, res) => {
  try {
    const { name, description, address, categoryId, areaId } = req.body
    if (!name.trim() || !description.trim() || !address.trim() || !categoryId.trim() || !areaId.trim()) {
      warningLogger.warn(`adminController/createRestaurant: All fields are required!`)
      return res.status(400).send({
        status: 'error',
        message: 'All fields are required!'
      })
    }
    await restaurantHelper.createRestaurant({ name, description, address, categoryId, areaId })
    return res.status(200).send({
      status: 'success',
      message: 'Successfully created a restaurant'
    })
  } catch (error) {
    errorLogger.error(`adminController/createRestaurant: ${error.stack}`)
    return res.status(500).send({
      status: 'error',
      message: 'Unable to create restaurant'
    })    
  }
}

const uploadRestaurantPic = async (req, res) => {
  try {
    const { restaurantId } = req.params
    const file = req.file
    if (!file) {
      warningLogger.warn(`adminController/uploadRestaurantPic: File missing!`)
      return res.status(400).send({
        status: 'error',
        message: 'File shouldn\'t be empty!'
      })
    }
    await s3ObjectStore.uploadRestaurantPic(file, restaurantId)
    const unlinkFile = util.promisify(fs.unlink)
    await unlinkFile(req.file.path)
    
    return res.status(200).send({
      status: 'success',
      message: 'Successfully uploaded a restaurant pic'
    })
  } catch (error) {
    errorLogger.error(`adminController/uploadRestaurantPic: ${error.stack}`)
    return res.status(500).send({
      status: 'error',
      message: 'Unable to upload restaurant pic'
    }) 
  }
}

module.exports = {
  createStaff,
  modifyUserBanStatus,
  getRestaurantByStatus,
  createRestaurant,
  uploadRestaurantPic
}
