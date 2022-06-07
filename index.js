const express = require('express')

const app = express()

if (process.env.ENV !== 'production') {
  require('dotenv').config()
}

require('./databases/mariaDB')

const PORT = process.env.PORT || 3000
const { infoLogger } = require('./utils/logger')

app.use(express.json())
app.use(express.urlencoded({ extended: false }))

app.listen(PORT, () => {
  infoLogger.info(`Express app is now running on port ${PORT}...`)
})