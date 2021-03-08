const winston = require('winston')
require('winston-daily-rotate-file')
const path = require('path')
const config = require('./config')

// - Write all logs with level `error` and below to `error.log`
const errors = new winston.transports.DailyRotateFile({
  filename: path.join(config.logDir(), 'error-%DATE%.log'),
  level: 'error',
  datePattern: 'YYYY-MM-DD-HH',
  zippedArchive: true,
  maxSize: '20m',
  maxFiles: '14d'
})

// - Write all logs with level `info` and below to `combined.log`
const combined = new winston.transports.DailyRotateFile({
  filename: path.join(config.logDir(), 'combined-%DATE%.log'),
  datePattern: 'YYYY-MM-DD-HH',
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

if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format: winston.format.combine(
      winston.format.colorize(),
      winston.format.printf(info =>
        `${info.level} [${info.timestamp}]: ${info.message} ${info.error ? '\n' + info.error : null}`
      )
    )
  }))
}

module.exports = logger
