const debug = require('debug')('indieweb-express-site:utilities:AppError')

// Shows a debug message for a throw error
// Emits a statusCode, message, and rawError that can be rendered by other functions

class AppError extends Error {
  constructor(statusCode, message, rawError) {
    console.log(' ')
    debug('-----------------------------')
    if (statusCode) debug(statusCode)
    if (message) debug(message)
    if (rawError) debug(rawError)
    debug('-----------------------------')
    console.log(' ')
    super()
    this.statusCode = statusCode
    this.message = message
    this.rawError = rawError
  }
}
module.exports = AppError
