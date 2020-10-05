const is = require('is_js')
const db = require('../../utilities/db')
const matter = require('gray-matter')

module.exports = {
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
  create: async function (meta, content, id) {
    if (!meta || !content || !id)
      throw new Error('You must supply all params')
    if (is.not.object(meta))
      throw new Error('Meta must be an object')
    if (is.not.string(content))
      throw new Error('Content must be a string')
    if (is.not.string(id))
      throw new Error('id must be a string')
    // IF META PROPERTIES DO NOT ALL MATCH NOTE FIELDS OR LOCAL FIELDS

    db.create('notes', matter.stringify(meta, content), id);
  },
  read: async function (id) {
    if (!id)
      throw new Error('A file ID must be supplied')
    if (is.not.string(id))
      throw new Error('id must be a string')
    return db.read('notes', id);
  },
  update: async function (meta, content, id) {
    if (!meta || !content || !id)
      throw new Error('You must supply all params')
    if (is.not.object(meta))
      throw new Error('Meta must be an object')
    if (is.not.string(content))
      throw new Error('Content must be a string')
    if (is.not.string(id))
      throw new Error('id must be a string')
    // IF META PROPERTIES DO NOT ALL MATCH NOTE FIELDS OR LOCAL FIELDS
    return db.update('notes', matter.stringify(meta, content), id);
  },
  delete: async function (id) {
    if (!id)
      throw new Error('A file ID must be supplied')
    if (is.not.string(id))
      throw new Error('id must be a string')
    return db.delete('notes', id);
  },
  settings: {
    defaults: {
      rss: true,
      listed: true,
      public: true
    },
    generateOwnRssFeed: true,
    includeInMainRssFeed: true,
  }
}


