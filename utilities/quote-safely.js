const debug = require('debug')('indieweb-express-site:utilities:quoteSafely')
const quote = require('quote')

const quoteSafely = (content) => {
  let quoted = quote(content)
  return quoted
}

module.exports = quoteSafely
