const debug = require('debug')('sonniesedge:models:utils:read')
const is = require('is_js')
const {markdown} = require('../../drivers')
const matter = require('gray-matter')

const modelRead = async (dir, cache, id) => {
  try {
    if (!dir || !id || !cache) throw new Error('You must supply all params')
    if (!id) throw new Error('id must be supplied')
    if (!dir) throw new Error('dir must be supplied')
    if (!cache) throw new Error('cache must be supplied')
    if (is.not.string(id)) throw new Error('The file ID must be a string')
    if (cache.has(id)) {
      debug(`Calling ${id} from ${dir} cache`)
      return matter(cache.get(id))
    }
    if (dir === 'static') {debug(`Calling ${id} from ${dir} disk file`)}
    let result = await markdown.read(dir, id)
    let resultObject = matter(result)
    resultObject.id = id
    cache.set(id, resultObject)
    // debug(resultObject)
    return resultObject
  } catch (error) {
    // TODO Add to error log
    debug(error)
    throw error
  }
}

module.exports = modelRead
