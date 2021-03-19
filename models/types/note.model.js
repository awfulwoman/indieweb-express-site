const Nodecache = require('node-cache')
const debug = require('debug')('indieweb-express-site:models:note')
const { modelCreate, modelRead, modelUpdate, modelDelete, cache } = require('../utils')
const { created, modified, title, guid, images, content } = require('../../fields')
const { DateTime } = require('luxon')
const chrono = require('chrono-node')

let modelCache = new Nodecache()

const id = 'note'
const modelDir = 'notes'

const defaultTitle = (datestamp) => {
  const parsedDate = DateTime.fromJSDate(chrono.parseDate(datestamp)).toUTC().toISODate();
  return `A note from ${parsedDate}`
}

const fields = [
  created,
  modified,
  guid,
  content,
  images
]

const settings = {
  rss: true,
  listed: true,
  public: true,
  generateOwnRssFeed: true,
  includeInMainRssFeed: true,
}

const create = async function (data, content, id) {
  return await modelCreate(modelDir, modelCache, data, content, id)
}

const read = async function (id) {
  return await modelRead(modelDir, modelCache, id, {
    defaultTitle: defaultTitle
  })
}

/** @description Update a note item
 * @param {object} data Metadata 
 * @param {string} content Item body content, in Markdown format
 * @param {string} id The file storage ID
 * @return {Promise}
 */
const update = async function (data, content, id) {
  return await modelUpdate(modelDir, modelCache, data, content, id)
}

const del = async function (id) {
  return await modelDelete(modelDir, modelCache, id)
}

const clearCache = async function (id) {
  return await cache.clearItem(modelCache, id)
}

const recentIndex = async () => {
  debug(`recentIndex for ${modelDir}`)
  let options = {
    honorHideFromIndex: true
  }
  return await cache.list(modelCache, modelDir, options)
}

const recentFeed = async () => {
  debug(`recentFeed for ${modelDir}`)
  let options = {
    honorHideFromFeed: true
  }
  return await cache.list(modelCache, modelDir, options)
}

/** @description Get index-visible archive items for this model in a particular date range
 * @param {object} dateObj An object describing the date required.
 * @param {integer} dateObj.year An integer representing a year
 * @param {integer} dateObj.month An integer representing a month
 * @param {integer} dateObj.day An integer representing a day
 * @return {Promise<Array>} An array of item objects for that date
 */
const archiveIndex = async (dateObj) => {
  let options = {
    dateObj: dateObj
  }
  return await cache.list(modelCache, modelDir, options)
}

const warm = async () => {
  debug(`Warming ${modelDir} cache.`)
  let options = {
    defaultTitle: defaultTitle
  }
  return await cache.warm(modelCache, modelDir, options)
}

module.exports = { 
  id, modelDir, fields, settings,
  create, read, update, del, recentIndex, recentFeed, warm, archiveIndex, clearCache
}
