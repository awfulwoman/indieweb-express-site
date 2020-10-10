
const globalFields = require('./_global')
const Nodecache = require('node-cache')
const debug = require('debug')('sonniesedge:models:note')
const { createBase, readBase, updateBase, deleteBase, cache } = require('./base')

let noteCache = new Nodecache()

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


const create = async function (data, content, id) {
  return await createBase(modelDir, noteCache, data, content, id)
}

const read = async function (id) {
  return await readBase(modelDir, noteCache, id)
}

const update = async function (data, content, id) {
  return await updateBase(modelDir, noteCache, data, content, id)
}

const del = async function (id) {
  return await deleteBase(modelDir, noteCache, id)
}

const settings = {
  rss: true,
  listed: true,
  public: true,
  generateOwnRssFeed: true,
  includeInMainRssFeed: true,
}

const recent = async () => {
  let temp = await cache.list(noteCache)
  // debug('Cache list', temp)
  return temp
}

module.exports = { modelDir, fields, create, read, update, del, settings, recent }
