const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const { Op } = require('sequelize')
const { errorLogger } = require('../utils/logger')
const User = require('../models/user')
const Rating = require('../models/rating')
const Restaurant = require('../models/restaurant')
const Favorite = require('../models/favorite')

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
        message: 'Wrong password!'
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
    const user = await User.findOne(
      {
        where: { email }
      },
      { raw: true, nest: true }
    )
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

const updatePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword, repeatPassword } = req.body
    if (!currentPassword.trim() || !newPassword.trim() || !repeatPassword.trim()) {
      return res.status(400).send({
        status: 'error',
        message: 'All fields are required!'
      })
    }
    const user = await User.findByPk(req.user.id)
    if (!user) {
      return res.status(403).send({
        status: 'error',
        message: 'This user has no permission to update password'
      })
    }
    const isPasswordMatch = await bcrypt.compare(currentPassword, user.password)
    if (!isPasswordMatch) {
      return res.status(400).send({
        status: 'error',
        message: 'Current password does not match old password!'
      })
    }
    if (newPassword.trim() !== repeatPassword.trim()) {
      return res.status(400).send({
        status: 'error',
        message: 'New passwords do not match!'
      })
    }
    const salt = await bcrypt.genSalt(10)
    const hash = await bcrypt.hash(newPassword.trim(), salt)
    await user.update({
      password: hash
    })

    return res.status(200).send({
      status: 'success',
      message: 'Updated user password successfully!'
    })
  } catch (error) {
    errorLogger.error(`userController/updatePassword: ${error}`)
    return res.status(500).send({
      status: 'error',
      message: 'Unable to update user password'
    })
  }
}

const getTop10PopularUsers = async (req, res) => {
  try {
    const users = await User.findAll({
      where: {
        roleId: {
          [Op.ne]: 1  // exclude admin
        }
      },
      attributes: ['id', 'nick_name', 'description', 'isBanned'],
      include: { model: User, as: 'Followers' }
    })
    if (!users.length) {
      return res.status(200).send([])
    }
    const result = users.map((user) => {
      const response = {
        id: 2,
        nick_name: user.nick_name,
        description: user.description,
        isBanned: user.isBanned,
        followerCount: user.Followers.length
      }
      return response
    })
    const sorted = result
      .sort((a, b) => {
        return b.followerCount - a.followerCount
      })
      .slice(0, 10)

    return res.status(200).send(sorted)
  } catch (error) {
    errorLogger.error(`userController/getTop10PopularUsers: ${error}`)
    return res.status(500).send({
      status: 'error',
      message: 'Unable to get top 10 popular users'
    })
  }
}

module.exports = {
  userRegister,
  userLogin,
  updatePassword,
  getTop10PopularUsers
}
