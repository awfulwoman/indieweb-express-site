
const globalFields = require('../_global')
const Nodecache = require('node-cache')
const debug = require('debug')('indieweb-express-site:models:page')
const { modelCreate, modelRead, modelUpdate, modelDelete, cache } = require('../utils')
const { created, modified, guid, content } = require('../../fields')

let modelCache = new Nodecache()

const id = 'page'
const modelDir = 'page'

const fields = [
  created,
  modified,
  guid,
  content
]

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
