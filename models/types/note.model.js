const is = require('is_js')
const markdownFile = require('../../utilities/markdownfile')

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
      type: 'group',
      description: 'Images',
      extendedDescription: 'Photos photos photos and stuff',
      repeat: {
        limit: 4,
        children: {
          image: {
            file: {
              type: 'string',
              description: 'Upload a photo',
              formFieldRender: 'file'
            },
            alt: {
              type: 'string',
              description: 'Alt text',
              formFieldRender: 'text'
            },
            width: {
              type: 'int',
              description: 'Image width',
              formFieldRender: 'text'
            },
            height: {
              type: 'int',
              description: 'Image height',
              formFieldRender: 'text'
            }
          }
        }
      }
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
  save: async function (meta, content, slug) {
    if (!meta || !content || !slug)
      throw 'You must supply all params'
    if (is.not.object(meta))
      throw 'Meta must be an object'
    if (is.not.string(content))
      throw 'Content must be a string'
    if (is.not.string(slug))
      throw 'slug must be a string'
    return db.save('notes', markdownFile(meta, content), slug || meta.slug);
  },
  update: async function (meta, content, slug) {
    if (!meta || !content || !slug)
      throw 'You must supply all params'
    if (is.not.object(meta))
      throw 'Meta must be an object'
    if (is.not.string(content))
      throw 'Content must be a string'
    if (is.not.string(slug))
      throw 'slug must be a string'
    return db.update('notes', markdownFile(meta, content), slug);
  },
  load: async function (slug) {
    if (!slug)
      throw 'A file ID must be supplied'
    if (is.not.string(slug))
      throw 'slug must be a string'
    return db.load('notes', slug);
  },
  delete: async function (slug) {
    if (!slug)
      throw 'A file ID must be supplied'
    if (is.not.string(slug))
      throw 'slug must be a string'
    return db.delete('notes', slug);
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


