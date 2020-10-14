const is = require('is_js')
const markdown = require('../../drivers/markdown')
const matter = require('gray-matter')

const modelDelete = async (dir, cache, id) => {
  try {
    if (!dir || !cache || !id) throw new Error('You must supply all params')
    if (!dir) throw new Error('A storage directory must be supplied')
    if (!id) throw new Error('A file ID must be supplied')
    if (is.not.string(dir)) throw new Error('dir must be a string')
    if (is.not.string(id)) throw new Error('The file ID must be a string')
    return markdown.del(dir, id)
  } catch (error) {
    // TODO Add to error log
    return Promise.reject(error)
  }
}

module.exports = modelDelete
