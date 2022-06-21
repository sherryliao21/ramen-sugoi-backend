const bcrypt = require('bcryptjs')
const util = require('util')
const fs = require('fs')
const userHelper = require('../models/user')
const restaurantHelper = require('../models/restaurant')
const commentHelper = require('../models/comment')
const s3ObjectStore = require('../service/s3')
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
    const { name, description, address } = req.body
    const categoryId = Number(req.body.categoryId)
    const areaId = Number(req.body.areaId)
    if (!name.trim() || !description.trim() || !address.trim() || !categoryId || !areaId) {
      warningLogger.warn(`adminController/createRestaurant: All fields are required!`)
      return res.status(400).send({
        status: 'error',
        message: 'All fields are required!'
      })
    }
    await restaurantHelper.createRestaurant({
      name: name,
      description: description,
      address: address,
      categoryId: categoryId,
      areaId: areaId,
      authorId: Number(req.user.id)
    })
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

const editRestaurant = async (req, res) => {
  try {
    const { restaurantId } = req.params
    const { name, description, address, categoryId, areaId, publishStatus } = req.body
    let restaurant = await restaurantHelper.getRestaurantByIdInBackstage(restaurantId)

    restaurant.name = name ? name : restaurant.name
    restaurant.description = description ? description : restaurant.description
    restaurant.address = address ? address : restaurant.address
    restaurant.categoryId = categoryId ? Number(categoryId) : restaurant.categoryId
    restaurant.areaId = areaId ? Number(areaId) : restaurant.areaId
    restaurant.authorId = Number(req.user.id)
    await restaurant.save()

    return res.status(200).send({
      status: 'success',
      message: 'Updated restaurant information successfully!'
    })
  } catch (error) {
    errorLogger.error(`adminController/editRestaurant: ${error}`)
    return res.status(500).send({
      status: 'error',
      message: 'Unable to edit restaurant information'
    })
  }
}

const editRestaurantStatus = async (req, res) => {
  try {
    const { restaurantId } = req.params
    const statusId = Number(req.body.statusId)
    const userId = Number(req.user.id)
    let restaurant = await restaurantHelper.getRestaurantByIdInBackstage(restaurantId)

    if (userId === Number(restaurant.authorId)) {
      warningLogger.warn(`adminController/editRestaurantStatus: Restaurant status has to be reviewed by staffs other than the author!`)
      return res.status(400).send({
        status: 'error',
        message: 'Restaurant status has to be reviewed by staffs other than the author!'
      })
    }
    if (
      (restaurant.statusId === 2 && statusId === 3) ||
      (restaurant.statusId === 1 && statusId === 2) ||
      (restaurant.statusId === 3 && statusId === 1)
    ) {
      restaurant.authorId = userId
      restaurant.statusId = statusId
      await restaurant.save()
      return res.status(200).send({
        status: 'success',
        message: 'Updated restaurant status successfully!'
      })
    }
    warningLogger.warn(`adminController/editRestaurantStatus: Restaurant status has to be updated one level higher/lower each time!`)
    return res.status(400).send({
      status: 'error',
      message: 'Restaurant status has to be updated one level higher/lower each time!'
    })
  } catch (error) {
    errorLogger.error(`adminController/editRestaurantStatus: ${error}`)
    return res.status(500).send({
      status: 'error',
      message: 'Unable to edit restaurant status'
    })
  }
}

const uploadRestaurantAvatar = async (req, res) => {
  try {
    const { restaurantId } = req.params
    const file = req.file
    if (!file) {
      warningLogger.warn(`adminController/uploadRestaurantAvatar: File missing!`)
      return res.status(400).send({
        status: 'error',
        message: "File shouldn't be empty!"
      })
    }
    await s3ObjectStore.uploadAvatar(file, restaurantId, 'restaurant')
    const unlinkFile = util.promisify(fs.unlink)
    await unlinkFile(req.file.path)

    return res.status(200).send({
      status: 'success',
      message: 'Successfully uploaded/updated a restaurant pic'
    })
  } catch (error) {
    errorLogger.error(`adminController/uploadRestaurantAvatar: ${error.stack}`)
    return res.status(500).send({
      status: 'error',
      message: 'Unable to upload/update restaurant pic'
    })
  }
}

const deleteRestaurantAvatar = async (req, res) => {
  try {
    const { restaurantId } = req.params
    await s3ObjectStore.deleteAvatar(restaurantId, 'restaurant')

    return res.status(200).send({
      status: 'success',
      message: 'Deleted restaurant avatar successfully!'
    })
  } catch (error) {
    errorLogger.error(`adminController/deleteRestaurantAvatar: ${error}`)
    return res.status(500).send({
      status: 'error',
      message: 'Unable to delete restaurant avatar'
    })
  }
}

const getUsers = async (req, res) => {
  try {
    const isBanned = Number(req.query.isBanned)
    const users = await userHelper.getUsers(isBanned)
    return res.status(200).send(users)
  } catch (error) {
    errorLogger.error(`adminController/getUsers: ${error}`)
    return res.status(500).send({
      status: 'error',
      message: 'Unable to get users list'
    })
  }
}

const getComments = async (req, res) => {
  try {
    const includeDeleted = Number(req.query.includeDeleted)
    const comments = await commentHelper.getComments(includeDeleted)
    return res.status(200).send(comments)
  } catch (error) {
    errorLogger.error(`adminController/getComments: ${error}`)
    return res.status(500).send({
      status: 'error',
      message: 'Unable to get comments list'
    })
  }
}

const deleteComment = async (req, res) => {
  try {
    const { commentId } = req.params
    const comment = await commentHelper.getCommentById(commentId)
    if (!comment) {
      warningLogger.warn(`adminController/deleteComment: No comment found`)
      return res.status(400).send({
        status: 'error',
        message: 'This comment does not exist!'
      })
    }
    await comment.destroy()
    return res.status(200).send({
      status: 'success',
      message: 'Successfully deleted comment!'
    })
  } catch (error) {
    errorLogger.error(`adminController/deleteComment: ${error}`)
    return res.status(500).send({
      status: 'error',
      message: 'Unable to delete comment'
    })     
  }
}

module.exports = {
  createStaff,
  modifyUserBanStatus,
  getRestaurantByStatus,
  createRestaurant,
  uploadRestaurantAvatar,
  deleteRestaurantAvatar,
  editRestaurant,
  editRestaurantStatus,
  getUsers,
  getComments,
  deleteComment
}
