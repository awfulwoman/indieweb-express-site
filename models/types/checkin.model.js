const Nodecache = require('node-cache')
const debug = require('debug')('indieweb-express-site:models:checkin')
const { modelCreate, modelRead, modelUpdate, modelDelete, cache } = require('../utils')
const field = require('../../fields')

let modelCache = new Nodecache()

const id = 'checkin'
const modelDir = 'checkins'

const fields = [
  field.created,
  field.modified,
  field.guid,
  field.tags,
  field.content
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
  return await modelRead(modelDir, modelCache, id)
}

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
  return await cache.list(modelCache, modelDir, {
    honorHideFromIndex: true
  })
}

const recentFeed = async () => {
  debug(`recentFeed for ${modelDir}`)
  return await cache.list(modelCache, modelDir, {
    honorHideFromFeed: true
  })
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
  return await cache.warm(modelCache, modelDir)
}

module.exports = { 
  id, modelDir, fields, settings,
  create, read, update, del, recentIndex, recentFeed, warm, archiveIndex, clearCache
}
