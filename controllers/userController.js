const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const { errorLogger } = require("../utils/logger")
const User = require('../models/user')

const userLogin = async (req, res) => {
  try {
    const { email, password, repeatPassword } = req.body
    if (!email.trim() || !password.trim()) {
      return res.status(401).send({
        status: 'error',
        message: "Field cannot be blank!"
      })
    }
    if (password !== repeatPassword) {
      return res.status(401).send({
        status: 'error',
        message: "Passwords don't match!"
      })
    }
    const user = await User.findOne({
      where: { email },
      raw: true,
      nest: true
    })
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

function test(req, res) {
  console.log('passed authentication')
  return res.status(200).send('ok!')
}

module.exports = {
  userLogin,
  test
}