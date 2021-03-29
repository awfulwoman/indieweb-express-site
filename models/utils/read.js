const debug = require('debug')('indieweb-express-site:models:utils:read')
const is = require('is_js')
const matter = require('gray-matter')

const normalizeItemObject = require('./normalize-item')
const addSyndications = require('./add-syndications')
const addScrapd = require('./add-scraped')
const { markdown } = require('../../drivers')

const modelRead = async (dir, cache, id, options = {}) => {
  try {
    if (!dir || !id || !cache) throw new Error('You must supply all params')
    if (!id) throw new Error('id must be supplied')
    if (!dir) throw new Error('dir must be supplied')
    if (!cache) throw new Error('cache must be supplied')
    if (is.not.string(id)) throw new Error('The file ID must be a string')

    // Item is present in the model cache
    if (cache.has(id) && !process.env['DEBUG']) {
      debug(`Reading ${dir}/${id} from cache.`)
      return cache.get(id)
    }

    // debug(`Reading ${dir}/${id} from file.`)

    // The item is not present in the model cache. Read from filesystem
    let result = await markdown.read(dir, id)

    let resultObject = matter(result)

    // if syndications read them
    resultObject = await addSyndications(resultObject, id, dir, options)
    resultObject = await addScrapd(resultObject, id, dir, options)
    
    // Normalize object (fix wonky dates, add missing fields, etc)
    resultObject = await normalizeItemObject(resultObject, id, dir, options)

    // debug(resultObject)

    let cachingActionResult = cache.set(id, resultObject)
    if (is.falsy(cachingActionResult)) { debug(`ERROR: Could not store ${dir}/${id} in cache!`) }
    
    return resultObject
  } catch (error) {
    throw error
  }
}

module.exports = modelRead
