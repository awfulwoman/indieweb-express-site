
const debug = require('debug')('sonniesedge:models:static');
const is = require('is_js')
const markdown = require('../../drivers/markdown')
const matter = require('gray-matter')
const globalFields = require('./_global')
const Nodecache = require('node-cache')
const { nodeCache } = require('../content')


module.exports = {
  modelDir: 'static', // special case
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
    try {
      if (!data || !content || !id) throw new Error('You must supply all params')
      if (is.not.object(data)) throw new Error('data must be an object')
      if (is.not.string(content)) throw new Error('Content must be a string')
      if (is.not.string(id)) throw new Error('The file ID must be a string')

      // Add globals if they are not present 
      for (const [key, value] of Object.entries(globalFields.fields)) {
        // console.log(`${key}: ${value}`);
        if (!data[key]) {
          data[key] = value.default
        }
      }

      // Check all property names match those in schema
      for (const field of data) {
        if (!globalFields.fields.hasOwnProperty(data[field])) throw new Error('Illegal property name')
        if (!this.fields.hasOwnProperty(data[field])) throw new Error('Illegal property name')
      }

      await markdown.create(this.modelDir, matter.stringify(data, content), id)
      return this.cachedItems.set(id)
    } catch (error) {
      // TODO Add to error log
      return Promise.reject(error)
    }
  },
  read: async function (id) {
    try {
      if (!id) throw new Error('A file ID must be supplied')
      if (is.not.string(id)) throw new Error('The file ID must be a string')
      if (this.cachedItems.has(id)) {
        let result = this.cachedItems.get(id)
        return matter(result)
      }

      let result = await markdown.read(this.modelDir, id)
      return matter(result)
    } catch (error) {
      // TODO Add to error log
      return Promise.reject(error)
    }
  },
  update: async function (data, content, id) {
    try {
      if (!data || !content || !id) throw new Error('You must supply all params')
      if (is.not.object(data)) throw new Error('data must be an object')
      if (is.not.string(content)) throw new Error('Content must be a string')
      if (is.not.string(id)) throw new Error('The file ID must be a string')
      // IF data PROPERTIES DO NOT ALL MATCH NOTE FIELDS OR LOCAL FIELDS
      return markdown.update(this.modelDir, matter.stringify(data, content), id)
    } catch (error) {
      // TODO Add to error log
      return Promise.reject(error)
    }
  },
  delete: async function (id) {
    try {
      if (!id) throw new Error('A file ID must be supplied')
      if (is.not.string(id)) throw new Error('The file ID must be a string')
      return markdown.delete(this.modelDir, id);
    } catch (error) {
      // TODO Add to error log
      return Promise.reject(error)
    }
  },
  cachedItems: new Nodecache(),
  settings: {
    rss: true,
    listed: true,
    public: true,
    generateOwnRssFeed: true,
    includeInMainRssFeed: true,
  }
}
