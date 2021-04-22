const debug = require('debug')('indieweb-express-site:models:utils:normalizeItem')

const { DateTime } = require('luxon')
const matter = require('gray-matter')
const removeMd = require('remove-markdown')

const defaultTitle = require('../utils/default-title')
const { md } = require('../../utilities')
const config = require('../../config')
const { markdown } = require('../../drivers')
const sanitizeDate = require('./sanitize-date')

const normalizeItemObject = async (resultObject, id, dir, options = {}) => {

  // debug(`Normalizing ${dir}/${id}.`)

  // Render content markdown to HTML if present
  if (resultObject && resultObject.content) {
    resultObject.contentFormats = {
      html: md.render(resultObject.content),
      markdown: resultObject.content,
      plain: removeMd(resultObject.excerpt || '')
    }
  }

  if (resultObject && resultObject.excerpt) {
    resultObject.excerptFormats = {
      html: md.render(resultObject.excerpt || ''),
      markdown: resultObject.excerpt,
      plain: removeMd(resultObject.excerpt || '')
    }
  }

  // Load sections and add to object
  if (resultObject && resultObject.data && resultObject.data.sections) {
    resultObject.sections = []
    for (let i = 0; i < resultObject.data.sections.length; i++) {
      let sectionData = matter(await markdown.readSection(dir, id, resultObject.data.sections[i]))
      sectionData.contentFormats = {
        html: md.render(sectionData.content),
        markdown: sectionData.content
      }
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

  // The proper name for the last modified date is "modified"
  if (resultObject.data.changed) {
    // debug('unclean data')
    resultObject.data.modified = sanitizeDate(resultObject.data.changed)
    delete resultObject.data.changed
  }
  if (resultObject.data.updated) {
    // debug('unclean data')
    resultObject.data.modified = sanitizeDate(resultObject.data.updated)
    resultObject.data.updated
  }


  if (!resultObject.storageId) resultObject.storageId = id
  if (!resultObject.storageType) resultObject.storageType = dir
  if (!resultObject.path) resultObject.path = `/${dir}/${resultObject.data.slug || id}`
  if (!resultObject.url) resultObject.url = `${config.siteProtocol()}${config.siteDomain()}${dir === 'pages' ? '' : '/' + dir}/${resultObject.data.slug || id}`
  // if (process.env.DEBUG) resultObject.raw = result

  return resultObject
}

module.exports = normalizeItemObject
