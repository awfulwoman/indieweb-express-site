const globalFields = require('../_global')
const Nodecache = require('node-cache')
const debug = require('debug')('sonniesedge:models:article')
const { modelCreate, modelRead, modelUpdate, modelDelete, cache, aliasUtil } = require('../utils')
const is = require('is_js')

let modelCache = new Nodecache()
let aliasCache = new Nodecache()

const modelDir = 'articles'

const fields = { // merge with global fields
  content: {
    type: 'string',
    required: true,
    description: 'Make a note',
    formFieldRender: 'textarea'
  },
  tags: {
    type: 'array',
    description: 'Tags related to this note',
    extendedDescription: 'Tags should be comma separated',
    example: 'apple, banana, cherry',
    formFieldRender: 'tags'
  },
  images: {
    type: 'object',
    description: 'Images',
    extendedDescription: 'Photos and stuff',
    formFieldRender: 'images'
  },
  created_geo: {
    type: 'string',
    description: 'Where this was created',
    formFieldRender: 'geo'
  },
  place_geo: {
    type: 'string',
    description: 'The position this relates to',
    formFieldRender: 'gps'
  },
  place_name: {
    type: 'string',
    description: 'The place this relates to',
    formFieldRender: 'place'
  }
}

const settings = {
  rss: true,
  listed: true,
  public: true,
  generateOwnRssFeed: true,
  includeInMainRssFeed: true,
}

const resolveAlias = async (slug) => {
  return await aliasUtil.get(aliasCache, slug)
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

const recentIndex = async () => {
  return await cache.list(modelCache, modelDir, {
    honorHideFromIndex: true
  })
}

const recentFeed = async () => {
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
  return await cache.warm(modelCache, modelDir, {
    modelAliasCache: aliasCache
  })
}

module.exports = { 
  modelDir, fields, settings,
  create, read, update, del, recentIndex, recentFeed, warm, archiveIndex, resolveAlias
}
