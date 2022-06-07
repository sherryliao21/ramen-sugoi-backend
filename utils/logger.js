// for winston (system/application logs)
const winston = require('winston')
const { format, transports, addColors, loggers } = require('winston')

const { combine, timestamp, label, printf } = format

const customLevels = {
  levels: {
    error: 0,
    warn: 1,
    info: 2,
    daemon: 3
  },
  colors: {
    error: 'bold black redBG',
    warn: 'bold black yellowBG',
    info: 'bold black greenBG',
    debug: 'bold black blueBG'
  }
}
addColors(customLevels.colors)
const fixedFormat = printf(({ level, message }) => `${level} ${message}`) // timestamp can be added to parameters

const mode = process.env.LOGGING_MODE || 'debug'
const silentSwitches = {
  debug: {
    error: false,
    warn: false,
    info: false,
    debug: false
  },
  production: {
    error: false,
    warn: false,
    info: true,
    debug: true
  }
}

loggers.add('debugLogger', {
  format: combine(
    label({ label: 'Debug' }),
    timestamp({
      format: 'YYYY-MM-DD HH:mm:ss'
    }),
    format.colorize(),
    fixedFormat
  ),
  transports: [new transports.Console({ level: 'debug' })],
  silent: silentSwitches[mode].debug
})

loggers.add('infoLogger', {
  format: combine(
    label({ label: 'Info' }),
    timestamp({
      format: 'YYYY-MM-DD HH:mm:ss'
    }),
    format.colorize(),
    fixedFormat
  ),
  transports: [new transports.Console({ level: 'info' })],
  silent: silentSwitches[mode].info
})

loggers.add('warningLogger', {
  format: combine(
    label({ label: 'Warning' }),
    timestamp({
      format: 'YYYY-MM-DD HH:mm:ss'
    }),
    format.colorize(),
    fixedFormat
  ),
  transports: [new transports.Console({ handleExceptions: true, level: 'warn' })],
  silent: silentSwitches[mode].warn,
  rejectionHandlers: [new transports.Console()]
})

loggers.add('errorLogger', {
  format: combine(
    label({ label: 'Error' }),
    timestamp({
      format: 'YYYY-MM-DD HH:mm:ss'
    }),
    format.colorize(),
    fixedFormat
  ),
  transports: [new transports.Console({ handleExceptions: true, level: 'error' })],
  silent: silentSwitches[mode].error,
  rejectionHandlers: [new transports.Console()]
})

const warningLogger = winston.loggers.get('warningLogger')
const errorLogger = winston.loggers.get('errorLogger')
const infoLogger = winston.loggers.get('infoLogger')
const debugLogger = winston.loggers.get('debugLogger')

module.exports = {
  warningLogger,
  errorLogger,
  infoLogger,
  debugLogger
}
