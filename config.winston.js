const winston = require('winston')
const path = require('path')
const config = require('./config')

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp({
      format: 'HH:mm:ss'
    }),
    winston.format.errors({ stack: true }),
    winston.format.splat(),
    winston.format.colorize(),
    winston.format.json()
  ),
  defaultMeta: { service: 'indieweb-express-site' },
  transports: [
    // - Write all logs with level `error` and below to `error.log`
    new winston.transports.File({ filename: path.join(config.logDir(), 'error.log'), level: 'error' }),
    // - Write all logs with level `info` and below to `combined.log`
    new winston.transports.File({ filename: path.join(config.logDir(), 'combined.log') })
  ]
})

if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format: winston.format.combine(
      winston.format.colorize(),
      winston.format.printf(info =>
        `${info.level} [${info.timestamp}]: ${info.message} ${info.error ? '\n' + info.error : null}`
      )
    ),
  }))
}

module.exports = logger
