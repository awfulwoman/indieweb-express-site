const debug = require('debug')('indieweb-express-site:utilities:stringToArray')
const is = require('is_js')

const stringToArray = (value, options = {}) => {
  debug(value)
  if (is.falsy(value)) return false
  return value.split(options.split || ',').map(tag => {
    return tag.trim()
  })
}

module.exports = stringToArray
