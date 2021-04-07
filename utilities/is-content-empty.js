const debug = require('debug')('indieweb-express-site:utilities:isContentEmpty')
const trimNewlines = require('trim-newlines')
const isStringBlank = require('is-string-blank')

const isContentEmpty = (content) => {
  let result = isStringBlank(trimNewlines(content))
  return (result)
}

module.exports = isContentEmpty
