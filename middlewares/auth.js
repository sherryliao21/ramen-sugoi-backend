const jwt = require('jsonwebtoken')
const User = require('../models/user')
const Role = require('../models/role')
const { warningLogger, errorLogger } = require('../utils/logger')

const isAuthenticated = async (req, res, next) => {
  try {
    const token = req.headers.authorization
    if (!token) {
      warningLogger.warn('auth/isAuthenticated: Token missing')
      return res.status(400).send({ status: 'error', message: 'Token missing' })
    }
    const isVerified = await jwt.verify(token, process.env.JWT_SECRET)
    if (!isVerified) {
      warningLogger.warn('auth/isAuthenticated: Verification error')
      return res.status(400).send({ status: 'error', message: 'Verification error' })
    }
    if (isVerified.exp * 1000 <= Date.now()) {
      warningLogger.warn('auth/isAuthenticated: Token expired')
      return res.status(400).send({ status: 'error', message: 'Token expired' })
    }
    const user = await User.findOne({
      where: { email: isVerified.email },
      raw: true,
      nest: true
    })
    if (!user) {
      warningLogger.warn('auth/isAuthenticated: User not found')
      return res.status(400).send({ status: 'error', message: 'User not found' })
    }
    req.user = {
      id: user.id,
      name: user.name,
      roleId: user.roleId
    }
    return next()
  } catch (error) {
    errorLogger.error(`auth/isAuthenticated: ${error}`)
    return res.status(500).send({
      status: 'error',
      message: 'Authentication error'
    })
  }
}

const isAdmin = async (req, res, next) => {
  try {
    const { roleId } = req.user
    const userRole = await Role.findOne({
      where: {
        id: roleId
      },
      raw: true,
      nest: true
    })
    if (userRole.name !== 'Admin') {
      warningLogger.warn(`authController/isAdmin: This user is not an admin.`)
      return res.status(401).send({
        status: 'error',
        message: 'No permission.'
      })
    }
    next()
  } catch (error) {
    errorLogger.error(`auth/isAdmin: ${error}`)
    return res.status(500).send({
      status: 'error',
      message: 'Authentication error'
    })
  }
}

const isUser = async (req, res, next) => {
  try {
    const { roleId } = req.user
    const userRole = await Role.findOne({
      where: {
        id: roleId
      },
      raw: true,
      nest: true
    })
    if (userRole.name !== 'User') {
      warningLogger.warn(`authController/isUser: This user is not a valid User.`)
      return res.status(401).send({
        status: 'error',
        message: 'No permission.'
      })
    }
    next()
  } catch (error) {
    errorLogger.error(`auth/isUser: ${error}`)
    return res.status(500).send({
      status: 'error',
      message: 'Authentication error'
    })
  }
}

module.exports = {
  isAuthenticated,
  isAdmin,
  isUser
}