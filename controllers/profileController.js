const fs = require('fs')
const util = require('util')
const { errorLogger } = require('../utils/logger')
const { User } = require('../models/index')
const s3ObjectStore = require('../service/s3')

const getProfile = async (req, res) => {
  try {
    const userId = req.user.id
    const user = await User.findByPk(userId, { nest: true, raw: true })
    if (!user) {
      return res.status(403).send({
        status: 'error',
        message: 'You have no permission to perform this action!'
      })
    }
    const response = {
      fullName: user.full_name,
      nickName: user.nick_name,
      email: user.email,
      description: user.description,
      profilePic: user.profile_pic
    }

    return res.status(200).send(response)
  } catch (error) {
    errorLogger.error(`userController/getProfile: ${error.stack}`)
    return res.status(500).send({
      status: 'error',
      message: 'Unable to get user profile'
    })
  }
}

const editProfile = async (req, res) => {
  try {
    const { fullName, nickName, description } = req.body
    const user = await User.findByPk(req.user.id)
    if (!user) {
      return res.status(403).send({
        status: 'error',
        message: 'You have no permission to perform this action!'
      })
    }
    user.full_name = fullName
    user.nick_name = nickName
    user.description = description

    await user.save()

    return res.status(200).send({
      status: 'success',
      message: 'Updated user profile successfully!'
    })
  } catch (error) {
    errorLogger.error(`userController/getProfile: ${error.stack}`)
    return res.status(500).send({
      status: 'error',
      message: 'Unable to edit user profile'
    })
  }
}

const uploadAvatar = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).send({
        status: 'error',
        message: 'File is missing'
      })
    }
    const user = await User.findByPk(req.user.id)
    if (!user) {
      return res.status(403).send({
        status: 'error',
        message: 'You have no permission to perform this action!'
      })
    }
    const result = await s3ObjectStore.uploadAvatar(req.file, req.user.id, 'user')
    // unlink file from fs so that uploads/ will be empty after done uploading to s3
    const unlinkFile = util.promisify(fs.unlink)
    await unlinkFile(req.file.path)

    return res.status(200).json({
      status: 'success',
      message: 'Upload file successfully!',
      result
    })
  } catch (error) {
    errorLogger.error(`userController/uploadAvatar: ${error.stack}`)
    return res.status(500).send({
      status: 'error',
      message: 'Unable to upload user avatar'
    })
  }
}

const getAvatar = async (req, res) => {
  try {
    const { userId } = req.params
    const result = await s3ObjectStore.getAvatar(userId)
    if (!result) {
      const defaultAvatar = 'https://imgur.com/Wrdjiye.png'
      return res.status(200).send({
        defaultAvatar
      })
    }
    return res.status(200).send(result)
  } catch (error) {
    errorLogger.error(`userController/getAvatar: ${error}`)
    return res.status(500).send({
      status: 'error',
      message: 'Unable to get user avatar'
    })
  }
}

const deleteAvatar = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id)
    if (!user) {
      return res.status(403).send({
        status: 'error',
        message: 'You have no permission to perform this action!'
      })
    }
    await s3ObjectStore.deleteAvatar(req.user.id, 'user')

    return res.status(200).send({
      status: 'success',
      message: 'Deleted user avatar successfully!'
    })
  } catch (error) {
    errorLogger.error(`userController/deleteAvatar: ${error}`)
    return res.status(500).send({
      status: 'error',
      message: 'Unable to delete user avatar'
    })
  }
}

module.exports = {
  getProfile,
  editProfile,
  uploadAvatar,
  getAvatar,
  deleteAvatar
}
