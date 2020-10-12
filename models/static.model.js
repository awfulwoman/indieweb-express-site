
const globalFields = require('./_global')
const Nodecache = require('node-cache')
const debug = require('debug')('sonniesedge:model:static')
const { createBase, readBase, updateBase, deleteBase, cache } = require('./base')

debug('Model activated')

let modelCache = new Nodecache()

const modelDir = 'static'

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
  }
}

const settings = {
  rss: false,
  listed: false,
  public: true,
  generateOwnRssFeed: false,
  includeInMainRssFeed: false,
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

module.exports = { modelDir, fields, create, read, update, del, settings }
