const debug = require('debug')('indieweb-express-site:models:utils:read')
const is = require('is_js')
const matter = require('gray-matter')

const normalizeItemObject = require('../normalize-item')
const addSyndications = require('../add-syndications')
const addScraped = require('../add-scraped')
const addTwitter = require('../add-tweetable-content')
const { markdown } = require('../../../drivers')

const modelRead = async (dir, cache, id, options = {}) => {

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

  function firstFourLines(file, options) {
    file.excerpt = file.excerpt || file.content.split('\n').slice(0, 4).join(' ')
  }

  let resultObject = matter(result, { excerpt: firstFourLines })

  // Add syndications file
  resultObject = await addSyndications(resultObject, id, dir, options)

  // Add scraped data file
  resultObject = await addScraped(resultObject, id, dir, options)

  // Normalize item (fix wonky dates, add missing fields, etc)
  resultObject = await normalizeItemObject(resultObject, id, dir, options)

  // Add a twitter content section
  resultObject = addTwitter(resultObject, options)

  let cachingActionResult = cache.set(id, resultObject)
  if (is.falsy(cachingActionResult)) throw new (`ERROR: Could not store ${dir}/${id} in cache!`)

  // debug(resultObject)

  return resultObject

}

module.exports = modelRead
