const trimNewlines = require('trim-newlines')

const cleanContent = (content) => {
  return trimNewlines(content)
}

module.exports = cleanContent
