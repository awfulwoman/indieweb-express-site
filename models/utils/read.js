const debug = require('debug')('sonniesedge:models:utils:read')
const is = require('is_js')
const matter = require('gray-matter')

const normalizeItemObject = require('./normalize-item')
const { markdown } = require('../../drivers')

const modelRead = async (dir, cache, id, options = {}) => {
  try {
    if (!dir || !id || !cache) throw new Error('You must supply all params')
    if (!id) throw new Error('id must be supplied')
    if (!dir) throw new Error('dir must be supplied')
    if (!cache) throw new Error('cache must be supplied')
    if (is.not.string(id)) throw new Error('The file ID must be a string')

    // Item is present in the model cache
    if (cache.has(id)) {
      debug(`Reading ${dir}/${id} from cache.`)
      return cache.get(id)
    }

    // The item is present in cache. Read from filesystem
    let result = await markdown.read(dir, id)
    let resultObject = matter(result)

    resultObject = await normalizeItemObject(resultObject, id, dir, options)

    let cachingActionResult = cache.set(id, resultObject)
    if (is.falsy(cachingActionResult)) { debug(`ERROR: Could not store ${dir}/${id} in cache!`) }
    
    return resultObject
  } catch (error) {
    // TODO Add to error log
    debug(error)
    throw error
  }
}

module.exports = modelRead
