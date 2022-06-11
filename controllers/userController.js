const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const fs = require('fs')
const util = require('util')
const { errorLogger } = require("../utils/logger")
const User = require('../models/user')
const s3ObjectStore = require('../service/s3')
const { raw } = require('express')

const userLogin = async (req, res) => {
  try {
    const { email, password } = req.body
    if (!email.trim() || !password.trim()) {
      return res.status(401).send({
        status: 'error',
        message: 'Field cannot be blank!'
      })
    }
    const user = await User.findOne({
      where: { email },
      raw: true,
      nest: true
    })
    if (!user) {
      return res.status(400).send({
        status: 'error',
        message: 'This user does not exist!'
      })
    }
    const userPassword = user.password
    const isPasswordMatch = await bcrypt.compareSync(password, userPassword)
    if (!isPasswordMatch) {
      return res.status(401).send({
        status: 'error',
        message: 'Verification error!'
      })
    }
    const userPayload = {
      id: user.id,
      fullName: user.full_name,
      email: user.email,
      profilePic: user.profile_pic,
      roleId: user.roleId,
      isBanned: false
    }
    const token = await jwt.sign(userPayload, process.env.JWT_SECRET, { expiresIn: '1h' })

    return res.status(200).send({
      userId: user.id,
      token
    })
  } catch (error) {
    errorLogger.error(`userController/userLogin: ${error}`)
    return res.status(500).send({
      status: 'error',
      message: 'Unable to log in'
    })
  }
}

const userRegister = async (req, res) => {
  try {
    const { email, password, repeatPassword, fullName } = req.body
    if (!email.trim() || !password.trim() || !repeatPassword.trim() || !fullName) {
      return res.status(400).send({
        status: 'error',
        message: 'All fields are required!'
      })
    }
    const user = await User.findOne({
      where: { email }
    }, { raw: true, nest: true })
    if (user) {
      return res.status(400).send({
        status: 'error',
        message: 'This email has been taken!'
      })
    }
    if (password !== repeatPassword) {
      return res.status(400).send({
        status: 'error',
        message: 'Passwords do not match!'
      })
    }
    const salt = await bcrypt.genSalt(10)
    const hash = await bcrypt.hash(password, salt)
    await User.create({
      email,
      password: hash,
      full_name: fullName
    })

    return res.status(200).send({
      status: 'success',
      message: 'Successfully created user!'
    })
  } catch (error) {
    errorLogger.error(`userController/userRegister: ${error.stack}`)
    return res.status(500).send({
      status: 'error',
      message: 'Unable to register new user'
    })
  }
}

const getProfile = async (req, res) => {
  try {
    const userId = req.user.id
    const user = await User.findByPk(userId, { nest: true, raw: true })
    if (!user) {
      return res.status(400).send({
        status: 'error',
        message: 'This user does not exist!'
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
    errorLogger.error(`userController/getProfile: ${error}`)
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
      return res.status(400).send({
        status: 'error',
        message: 'This user does not exist!'
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
    errorLogger.error(`userController/getProfile: ${error}`)
    return res.status(500).send({
      status: 'error',
      message: 'Unable to get user profile'
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
    const result = await s3ObjectStore.uploadAvatar(req.file, req.user.id)
    // unlink file from fs so that uploads/ will be empty after done uploading to s3
    const unlinkFile = util.promisify(fs.unlink)
    await unlinkFile(req.file.path)

    return res.status(200).json({
      status: 'success',
      message: 'Upload file successfully!',
      result
    })
  } catch (error) {
    errorLogger.error(`userController/uploadAvatar: ${error}`)
    return res.status(500).send({
      status: 'error',
      message: 'Unable to upload user avatar'
    })
  }
}

const getAvatar = async (req, res) => {
  try {
    const result = await s3ObjectStore.getAvatar(req.user.id)
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

module.exports = {
  userRegister,
  userLogin,
  getProfile,
  editProfile,
  uploadAvatar,
  getAvatar
}