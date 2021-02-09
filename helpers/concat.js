const debug = require('debug')('indieweb-express-site:helpers:concat')

const concat = function(arguments) {
  debug('called')
  arguments = [...arguments].slice(0, -1)
  return arguments.join('')
}

module.exports = concat
