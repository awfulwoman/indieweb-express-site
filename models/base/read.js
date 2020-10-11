const is = require('is_js')
const markdown = require('../../drivers/markdown')
const matter = require('gray-matter')

const readBase = async (dir, cache, id) => {
  try {
    if (!dir || !id || !cache) throw new Error('You must supply all params')
    if (!id) throw new Error('id must be supplied')
    if (!dir) throw new Error('dir must be supplied')
    if (!cache) throw new Error('cache must be supplied')
    if (is.not.string(id)) throw new Error('The file ID must be a string')
    if (cache.has(id)) {
      return matter(cache.get(id))
    }

    let result = await markdown.read(dir, id)
    let resultObject = matter(result)
    cache.set(id, resultObject)
    return resultObject
  } catch (error) {
    // TODO Add to error log
    return Promise.reject(error)
  }
}

module.exports = readBase
