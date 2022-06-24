const express = require('express')
const { infoLogger, logRequest } = require('./utils/logger')

const app = express()
if (process.env.ENV !== 'production') {
  require('dotenv').config()
}
const PORT = process.env.PORT || 3000

const { ramenDB, authenticateDB } = require('./databases/mariaDB')
authenticateDB(ramenDB, 'ramenDB')
require('./models/index').syncDB(ramenDB)
const routes = require('./routes/index')

app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(logRequest)
app.use(routes)

app.listen(PORT, () => {
  infoLogger.info(`Express app is now running on port ${PORT}...`)
})
