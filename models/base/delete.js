const is = require('is_js')
const markdown = require('../../drivers/markdown')
const matter = require('gray-matter')

const deleteBase = async (modelDir, id) => {
  try {
    if (!id) throw new Error('A file ID must be supplied')
    if (is.not.string(id)) throw new Error('The file ID must be a string')
    return markdown.delete(modelDir, id)
  } catch (error) {
    // TODO Add to error log
    return Promise.reject(error)
  }
}

module.exports = deleteBase
