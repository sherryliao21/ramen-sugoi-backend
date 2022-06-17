const bcrypt = require('bcryptjs')
const userHelper = require('../models/user')
const { errorLogger } = require('../utils/logger')
const { User } = require('../models/index')

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
    errorLogger.error(`commentController/createStaff: ${error.stack}`)
    return res.status(500).send({
      status: 'error',
      message: 'Unable to create staff'
    })
  }
}

module.exports = {
  createStaff
}
