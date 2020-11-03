const debug = require('debug')('sonniesedge:middleware:errorHandler')
class ErrorHandler extends Error {
  constructor(statusCode, message, rawError) {
    console.log(' ')
    debug('-----------------------------')
    if(statusCode) debug('statusCode: ', statusCode)
    if(message) debug('message: ', message)
    if(rawError) debug('rawError: ', rawError)
    debug('-----------------------------')
    console.log(' ')
    super();
    this.statusCode = statusCode;
    this.message = message;
    this.rawError = rawError;
  }
}
module.exports = ErrorHandler
