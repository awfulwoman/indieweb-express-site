const debug = require('debug')('sonniesedge:utilities:contentpath');

// TODO: Remove. No longer used. 

const constructContentPath = function (first, second) {
    debug('constructContentPath - first:', first);
    debug('constructContentPath - second:', second);
    if (!first && !second) {
      return '/'
    }
  
    if (first && !second) {
      if (first === '/') {
        return '/'
      } else {
        return `/${first}/`
      }
    }
  
    if (first && second) {
      return `/${first}/${second}/`
    }
  }

  module.exports = constructContentPath
