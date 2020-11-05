const globalFields = require('../_global')
const Nodecache = require('node-cache')
const debug = require('debug')('sonniesedge:models:note')
const { modelCreate, modelRead, modelUpdate, modelDelete, cache } = require('../utils')
const { DateTime } = require('luxon')
const chrono = require('chrono-node')


let modelCache = new Nodecache()

const modelDir = 'notes'

const defaultTitle = (datestamp) => {
  let parsedDate = DateTime.fromJSDate(chrono.parseDate(datestamp)).toLocaleString({ locale: 'en-gb' });
  return `A note from ${parsedDate}`
}

const fields = { // merge with global fields
  title: {
    type: 'string',
    required: true,
    description: 'A title for this note, if so desired',
  },
  content: {
    type: 'string',
    required: true,
    description: 'Make a note'
  },
  tags: {
    type: 'array',
    description: 'Tags related to this note',
    extendedDescription: 'Tags should be comma separated',
    example: 'apple, banana, cherry'
  },
  images: {
    type: 'object',
    description: 'Images',
    extendedDescription: 'Photos and stuff'
  },
  creation_geo: {
    type: 'string',
    description: 'Where this was created'
  },
  place: {
    type: 'object', // contains: gps, name, address, google_maps_id
    description: 'The place this relates to'
  }
}

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

const recentIndex = async () => {
  let options = {
    honorHideFromIndex: true
  }
  return await cache.list(modelCache, modelDir, options)
}

const recentFeed = async () => {
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
  modelDir, fields, settings,
  create, read, update, del, recentIndex, recentFeed, warm, archiveIndex
}
