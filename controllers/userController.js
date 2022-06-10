const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const { errorLogger } = require("../utils/logger")
const User = require('../models/user')
const Role = require('../models/role')
const Area = require('../models/area')

const userLogin = async (req, res) => {
  try {
    const { email, password, repeatPassword } = req.body
    if (!email.trim() || !password.trim()) {
      return res.status(401).send({
        status: 'error',
        message: 'Field cannot be blank!'
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

async function getProfile(req, res) {
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

async function test(req, res) {
  try {
    // await Role.create({
    //   id: 1,
    //   name: 'Admin'
    // })
    // await User.create(
    //   {
    //     full_name: 'test',
    //     nick_name: 'test123',
    //     email: 'test@example.com',
    //     password: '$2y$10$88n.KjLN1kw1O8LLXFT96u6W950FgFNNtokFWyef6dNXsiNHXPclu',
    //     description: 'test123123',
    //     profile_pic: null,
    //     isBanned: false,
    //     roleId: 1
    //   },
    //   (err, docs) => {
    //     if (err) throw err
    //     console.log(docs)
    //   }
    // )
    await Area.create({
      id: 1,
      name: 'Taipei'
    })
    return res.status(200).send('ok!')
  } catch (error) {
    errorLogger.error(`userController/test: ${error}`)
    return res.status(500).send({
      status: 'error',
      message: 'ERROR'
    })
  }
  return res.status(200).send('ok!')
}

module.exports = {
  userLogin,
  getProfile,
  test
}