const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const userHelper = require('../models/user')
const { errorLogger, warningLogger } = require('../utils/logger')
const { User, Restaurant } = require('../models/index')

const userLogin = async (req, res) => {
  try {
    const { email, password } = req.body
    if (!email.trim() || !password.trim()) {
      return res.status(400).send({
        status: 'error',
        message: 'Field cannot be blank!'
      })
    }
    const user = await userHelper.getUserByEmail(email)
    if (!user) {
      return res.status(404).send({
        status: 'error',
        message: 'This user does not exist!'
      })
    }
    const userPassword = user.password
    const isPasswordMatch = await bcrypt.compareSync(password, userPassword)
    if (!isPasswordMatch) {
      return res.status(400).send({
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
    errorLogger.error(`userController/userLogin: ${error.stack}`)
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
    const user = await userHelper.getUserByEmail(email)
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
    await userHelper.createUser({
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
    const isModel = true
    const user = await userHelper.getUserById(req.user.id, isModel)
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
    errorLogger.error(`userController/updatePassword: ${error.stack}`)
    return res.status(500).send({
      status: 'error',
      message: 'Unable to update user password'
    })
  }
}

const getTop10UsersByCategory = async (req, res) => {
  try {
    const modelConfig = {
      active: {
        model: Restaurant,
        tableName: 'CommentedRestaurants',
        count: 'commentCount'
      },
      popular: {
        model: User,
        tableName: 'Followers',
        count: 'followerCount'
      }
    }
    const { category } = req.params
    const users = await userHelper.getUsersByCategory(category, modelConfig)
    if (!users.length) {
      return res.status(200).send([])
    }
    const result = users
      .filter((user) => !user.isBanned)
      .map((user) => {
        const response = {
          id: user.id,
          nick_name: user.nick_name,
          description: user.description,
          isBanned: user.isBanned,
          [modelConfig[category].count]: user[modelConfig[category].tableName].length
        }
        return response
      })
    const sorted = result.sort((a, b) => b[modelConfig[category].count] - a[modelConfig[category].count]).slice(0, 10)

    return res.status(200).send(sorted)
  } catch (error) {
    const { category } = req.params
    errorLogger.error(`userController/getTop10UsersByCategory: ${error.stack}`)
    return res.status(500).send({
      status: 'error',
      message: `Unable to get top 10 ${category} users`
    })
  }
}

const getUser = async (req, res) => {
  try {
    const { userId } = req.params
    const includeRelatedData = [
      {
        model: User,
        as: 'Followers',
        attributes: ['id', 'nick_name']
      },
      {
        model: User,
        as: 'Followings',
        attributes: ['id', 'nick_name']
      },
      {
        model: Restaurant,
        as: 'CommentedRestaurants',
        attributes: ['id', 'name']
      },
      {
        model: Restaurant,
        as: 'LikedRestaurants',
        attributes: ['id', 'name']
      }
    ]
    const user = await userHelper.getUserWithRelatedData(userId, includeRelatedData)
    if (!user) {
      warningLogger.warn('This user does not exist')
      return res.status(404).send({
        status: 'error',
        message: 'This user does not exist'
      })
    }
    return res.status(200).send(user)
  } catch (error) {
    errorLogger.error(`userController/getUser: ${error.stack}`)
    return res.status(500).send({
      status: 'error',
      message: 'Unable to get user'
    })
  }
}

module.exports = {
  userRegister,
  userLogin,
  updatePassword,
  getTop10UsersByCategory,
  getUser
}
