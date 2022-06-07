const jwt = require('jsonwebtoken')
const User = require('../models/user')
const { warningLogger } = require('../utils/logger')

const isAuthenticated = async (req, res, next) => {
  try {
    const token = req.headers.authorization.replace(/['"]+/g, '')
    if (!token) {
      warningLogger.warn('auth/isAuthenticated: Token missing')
      return res.status(400).send({ status: 'error', message: 'Token missing' })
    }
    const isVerified = await jwt.verify(token, process.env.JWT_SECRET)
    if (!isVerified) {
      warningLogger.warn('auth/isAuthenticated: Verification error')
      return res.status(400).send({ status: 'error', message: 'Verification error' })
    }
    if (isVerified.exp * 1000 >= Date.now()) {
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
    return next()
  } catch (error) {
    errorLogger.error(`auth/isAuthenticated: ${error}`)
    return res.status(500).send({
      status: 'error',
      message: 'Authentication error'
    })
  }
}

module.exports = {
  isAuthenticated
}