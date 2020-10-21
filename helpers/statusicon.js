const debug = require('debug')('sonniesedge:helpers:statusIcon');


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
    debug(error)
    throw error
  }
}

module.exports = statusIcon;
