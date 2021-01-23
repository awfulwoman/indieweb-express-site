
const globalFields = require('../_global')
const Nodecache = require('node-cache')
const debug = require('debug')('indieweb-express-site:models:page')
const { modelCreate, modelRead, modelUpdate, modelDelete, cache } = require('../utils')

let modelCache = new Nodecache()

const id = 'page'
const modelDir = 'page'

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

const read = async function (id) {
  return await modelRead(modelDir, modelCache, id)
}

module.exports = { 
  id, modelDir, fields, settings,
  read
}
