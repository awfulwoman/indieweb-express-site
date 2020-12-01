const debug = require('debug')('sonniesedge:models:utils:read')
const is = require('is_js')
const { markdown } = require('../../drivers')
const matter = require('gray-matter')
const md = require('../../utilities/markdown-it')
const config = require('../../config')
const defaultTitle = require('../utils/default-title')
const ErrorHandler = require('../../utilities/error-handler')
const chrono = require('chrono-node')
const { DateTime } = require('luxon')

const modelRead = async (dir, cache, id, options = {}) => {
  try {
    if (!dir || !id || !cache) throw new Error('You must supply all params')
    if (!id) throw new Error('id must be supplied')
    if (!dir) throw new Error('dir must be supplied')
    if (!cache) throw new Error('cache must be supplied')
    if (is.not.string(id)) throw new Error('The file ID must be a string')

    // Item is present in the model cache
    if (cache.has(id)) {
      debug(`Calling ${id} from ${dir} cache`)
      return cache.get(id)
    }

    // The item is present in cache. Read from filesystem
    let result = await markdown.read(dir, id)
    // debug(dir, id)
    let resultObject = matter(result)

    if (resultObject && resultObject.content) {
      resultObject.rendered = md.render(resultObject.content)
    }

    if (resultObject && resultObject.data && resultObject.data.sections) {
      resultObject.sections = []
      for (let i = 0; i < resultObject.data.sections.length; i++) {
        let sectionData = matter(await markdown.readSection(dir, id, resultObject.data.sections[i]))
        sectionData.rendered = md.render(sectionData.content)
        resultObject.sections.push(sectionData)
      }
    }

    if (!resultObject.data.title) {
      resultObject.data.title = options.defaultTitle ? options.defaultTitle(resultObject.data.created) : defaultTitle(resultObject.data.created)
    }

    const sanitizeDate = (dateInput) => {
      try {
        if (is.date(dateInput)) {
          return DateTime.fromJSDate(dateInput).toUTC().toISO()
        } else {
          return DateTime.fromJSDate(chrono.parseDate(dateInput)).toUTC().toISO()
        }
      } catch (error) {
        debug(dateInput)
        debug(error)
        return dateInput
      }
    }


    // // TODO: fucks sake, sort this mass of awful date
    if (resultObject.data.created) resultObject.data.created = sanitizeDate(resultObject.data.created)
    if (resultObject.data.modified) resultObject.data.modified = sanitizeDate(resultObject.data.modified)
    if (resultObject.data.changed) {
      // debug('unclean data')
      resultObject.data.changed = sanitizeDate(resultObject.data.changed)
    }
    if (resultObject.data.updated) {
      // debug('unclean data')
      resultObject.data.updated = sanitizeDate(resultObject.data.updated)
    }

    resultObject.id = id
    resultObject.storage = dir
    resultObject.path = `/${dir}/${resultObject.data.slug || id}`
    resultObject.url = `${config.siteProtocol()}${config.siteDomain()}/${dir}/${resultObject.data.slug || id}`
    // if (process.env.DEBUG) resultObject.raw = result

    let cachingActionResult = cache.set(id, resultObject)
    if (is.falsy(cachingActionResult)) { debug(`Did not store ${id} in ${dir} cache!`) }
    
    return resultObject
  } catch (error) {
    // TODO Add to error log
    debug(error)
    throw error
  }
}

module.exports = modelRead
