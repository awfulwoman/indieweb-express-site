const outdent = require('outdent')
const matter = require('gray-matter')

// TODO: rename to "createMarkdown" or similar
const markdownFile = (meta, content) => {
  return matter.stringify(meta, content)
}

module.exports = markdownFile
