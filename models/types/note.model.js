const globalFields = require('../_global')
const Nodecache = require('node-cache')
const debug = require('debug')('sonniesedge:model:note')
const { modelCreate, modelRead, modelUpdate, modelDelete, cache } = require('../utils')

debug('Model activated')

let modelCache = new Nodecache()

const modelDir = 'notes'

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
  creation_geo: {
    type: 'string',
    description: 'Where this was created',
    formFieldRender: 'geo'
  },
  place: {
    type: 'object', // contains: gps, name, address, google_maps_id
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

const create = async function (data, content, id) {
  return await modelCreate(modelDir, modelCache, data, content, id)
}

const read = async function (id) {
  return await modelRead(modelDir, modelCache, id)
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

const recent = async () => {
  return await cache.list(modelCache, modelDir)
}

const warm = async () => {
  debug(`Warming ${modelDir} cache.`)
  return await cache.warm(modelCache, modelDir)
}

module.exports = { modelDir, fields, create, read, update, del, settings, recent, warm }
