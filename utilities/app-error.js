const debug = require('debug')('indieweb-express-site:utilities:AppError')
// const logger = require('../config.winston')

// Shows a debug message for a throw error
// Emits a statusCode, message, and rawError that can be rendered by other functions

class AppError extends Error {
  constructor(statusCode, message, rawError) {
    // logger.error({
    //   message: message || 'NO MESSAGE SUPPLIED',
    //   error: rawError || 'NO ERROR SUPPLIED'
    // })
    super()
    this.statusCode = statusCode
    this.message = message
    this.rawError = rawError
  }
}
module.exports = AppError
