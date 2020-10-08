const outdent = require('outdent')
const matter = require('gray-matter')

const markdownFile = (meta, content) => {
  return matter.stringify(meta, content)
}

module.exports = markdownFile
