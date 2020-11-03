const debug = require('debug')('sonniesedge:helpers:statusIcon')
const ErrorHandler = require('../utilities/error-handler')

const statusIcon = function(context) {
  try {
    switch (context) {
      case 'error':
        return '⚠️'
        break
    
      default:
        return content
        break
    }
  } catch (error) {
    throw error
  }
}

module.exports = statusIcon;
