const is = require('is_js')
const markdown = require('../../drivers/markdown')
const matter = require('gray-matter')

const readBase = async (modelDir, cache, id) => {
  try {
    if (!id) throw new Error('A file ID must be supplied')
    if (is.not.string(id)) throw new Error('The file ID must be a string')
    if (cache.has(id)) {
      let result = cache.get(id)
      return matter(result)
    }

    let result = await markdown.read(modelDir, id)
    return matter(result)
  } catch (error) {
    // TODO Add to error log
    return Promise.reject(error)
  }
}

module.exports = readBase
