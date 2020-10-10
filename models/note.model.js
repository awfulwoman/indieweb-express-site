
const globalFields = require('./_global')
const Nodecache = require('node-cache')
const {createBase, readBase, updateBase, deleteBase} = require('./base')

module.exports = {
  modelDir: 'notes',
  fields: { // merge with global fields
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
  },
  // CRUD
  create: async function (data, content, id) {
    return await createBase(this.modelDir, this.cachedItems, data, content, id)
  },
  read: async function (id) {
    return await readBase(this.modelDir, this.cachedItems, id)
  },
  update: async function (data, content, id) {
    return await updateBase(this.modelDir, this.cachedItems, data, content, id)
  },
  delete: async function (id) {
    return await deleteBase(this.modelDir, this.cachedItems, id)
  },
  cachedItems: new Nodecache(),
  settings: {
    rss: true,
    listed: true,
    public: true,
    generateOwnRssFeed: true,
    includeInMainRssFeed: true,
  },
  recent: async () => {
    try {

    } catch (error) {

    }
  }
}


