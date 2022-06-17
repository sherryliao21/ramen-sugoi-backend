const jwt = require('jsonwebtoken')
const { Op } = require('sequelize')
const { User, Role } = require('../models/index')
const { warningLogger, errorLogger } = require('../utils/logger')
const userHelper = require('../models/user')
const roleHelper = require('../models/role')

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
    const user = await userHelper.getUserByEmail(isVerified.email)
    if (!user) {
      warningLogger.warn('auth/isAuthenticated: User not found')
      return res.status(400).send({ status: 'error', message: 'User not found' })
    }
    req.user = {
      ...req.user,
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

const isStaff = async (req, res, next) => {
  try {
    const { roleId } = req.user
    const userRole = await roleHelper.getRoleById(roleId)
    if (userRole.name === 'User') {
      warningLogger.warn('authController/isStaff: This user is not a staff.')
      return res.status(401).send({
        status: 'error',
        message: 'No permission.'
      })
    }
    next()
  } catch (error) {
    errorLogger.error(`auth/isStaff: ${error}`)
    return res.status(500).send({
      status: 'error',
      message: 'Authentication error'
    })
  }
}

const isAdmin = async (req, res) => {
  try {
    const { roleId } = req.user
    const userRole = await roleHelper.getRoleById(roleId)
    if (userRole.name !== 'Admin') {
      warningLogger.warn('authController/isAdmin: This user is not an admin.')
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
    const userRole = await roleHelper.getRoleById(roleId)
    if (userRole.name !== 'User') {
      warningLogger.warn('authController/isUser: This user is not a valid User.')
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

const isNotBanned = async (req, res, next) => {
  try {
    const { roleId } = req.user
    const userRole = await roleHelper.getRoleById(roleId)
    if (userRole.name !== 'User') {
      warningLogger.warn('authController/isNotBanned: This user is not a valid User.')
      return res.status(401).send({
        status: 'error',
        message: 'No permission.'
      })
    }
    const userId = req.user.id
    const user = await userHelper.getValidUserById(userId)
    if (!user) {
      warningLogger.warn('authController/isNotBanned: This user is banned.')
      return res.status(401).send({
        status: 'error',
        message: 'No permission.'
      })
    }
    next()
  } catch (error) {
    errorLogger.error(`auth/isNotBanned: ${error}`)
    return res.status(500).send({
      status: 'error',
      message: 'Authentication error'
    })
  }
}

module.exports = {
  isAuthenticated,
  isStaff,
  isAdmin,
  isUser,
  isNotBanned
}
