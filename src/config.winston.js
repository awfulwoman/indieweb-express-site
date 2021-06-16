const winston = require('winston')
require('winston-daily-rotate-file')
const path = require('path')
const config = require('./config')

// - Write all logs with level `error` and below to `error.log`
const errors = new winston.transports.DailyRotateFile({
  filename: path.join(config.logDir(), 'app', 'error-%DATE%.log'),
  level: 'error',
  datePattern: 'YYYY-MM-DD',
  zippedArchive: true,
  maxSize: '20m',
  maxFiles: '14d'
})

// - Write all logs with level `info` and below to `combined.log`
const combined = new winston.transports.DailyRotateFile({
  filename: path.join(config.logDir(), 'app', 'combined-%DATE%.log'),
  datePattern: 'YYYY-MM-DD',
  zippedArchive: true,
  maxSize: '20m',
  maxFiles: '14d'
})

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp({
      format: 'HH:mm:ss'
    }),
    winston.format.errors({ stack: true }),
    winston.format.splat(),
    winston.format.json()
  ),
  defaultMeta: { service: 'indieweb-express-site' },
  transports: [
    errors,
    combined
  ]
})

function errorReplacer(value) {
  if (value instanceof Error) {
    return value.stack
  }
  return value
}

if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format: winston.format.combine(
      winston.format.errors({ stack: true }),
      winston.format.colorize(),
      winston.format.splat(),
      winston.format.printf((item) => {
        // console.log(item)
        if (item.error) return `${item.timestamp} ${item.level}: ${item.message} \n ${errorReplacer(item.error)}`
        return `${item.timestamp} ${item.level}: ${item.message}`
      })
    )
  }))
}

module.exports = logger
