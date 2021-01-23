const debug = require('debug')('indieweb-express-site:models:utils:normalizeItem')

const { DateTime } = require('luxon')
const is = require('is_js')
const matter = require('gray-matter')

const defaultTitle = require('../utils/default-title')
const md = require('../../utilities/markdown-it')
const config = require('../../config')
const AppError = require('../../utilities/app-error')
const { markdown } = require('../../drivers')
const sanitizeDate = require('./sanitize-date')

const normalizeItemObject = async (resultObject, id, dir, options = {}) => {

  // debug(`Normalizing ${dir}/${id}.`)

  // Render content markdown to HTML if present
  if (resultObject && resultObject.content) {
    resultObject.rendered = md.render(resultObject.content)
  }

  // Load sections and add to object
  if (resultObject && resultObject.data && resultObject.data.sections) {
    resultObject.sections = []
    for (let i = 0; i < resultObject.data.sections.length; i++) {
      let sectionData = matter(await markdown.readSection(dir, id, resultObject.data.sections[i]))
      sectionData.rendered = md.render(sectionData.content)
      resultObject.sections.push(sectionData)
    }
  }

  // Add a title if non present
  if (!resultObject.data.title) {
    resultObject.data.title = options.defaultTitle ? options.defaultTitle(resultObject.data.created) : defaultTitle(resultObject.data.created)
  }

  // If no created date, add one now
  if (!resultObject.data.created) resultObject.data.created = DateTime.local().toUTC().toISO()

  // Make sure dates aren't in JS Date format
  // TODO: Sanitize dates
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


  if (!resultObject.id) resultObject.id = id
  if (!resultObject.storage) resultObject.storage = dir
  if (!resultObject.path) resultObject.path = `/${dir}/${resultObject.data.slug || id}`
  if (!resultObject.url) resultObject.url = `${config.siteProtocol()}${config.siteDomain()}/${dir}/${resultObject.data.slug || id}`
  // if (process.env.DEBUG) resultObject.raw = result

  return resultObject
}

module.exports = normalizeItemObject
