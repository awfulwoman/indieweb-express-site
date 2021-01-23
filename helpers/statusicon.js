const debug = require('debug')('indieweb-express-site:helpers:statusIcon')
const AppError = require('../utilities/app-error')

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
