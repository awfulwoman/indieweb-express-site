const globalFields = require('../_global')
const Nodecache = require('node-cache')
const debug = require('debug')('sonniesedge:model:bookmark')
const { createBase, readBase, updateBase, deleteBase, cache } = require('../base')

debug('Model activated')

let modelCache = new Nodecache()

const modelDir = 'bookmarks'

const fields = { // merge with global fields
  title: {
    type: 'string',
    required: true,
    description: 'Title of the linked document',
    formFieldRender: 'textfield'
  },
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
  created_geo: {
    type: 'string',
    description: 'Where this was created',
    formFieldRender: 'geo'
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
  return await createBase(modelDir, modelCache, data, content, id)
}

const read = async function (id) {
  return await readBase(modelDir, modelCache, id)
}

const update = async function (data, content, id) {
  return await updateBase(modelDir, modelCache, data, content, id)
}

const del = async function (id) {
  return await deleteBase(modelDir, modelCache, id)
}

const recent = async () => {
  return await cache.list(modelCache, modelDir)
}

const warm = async () => {
  debug(`Warming ${modelDir} cache.`)
  return await cache.warm(modelCache, modelDir)
}

module.exports = { modelDir, fields, create, read, update, del, settings, recent, warm }
