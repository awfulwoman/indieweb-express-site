const { string, boolean } = require("is_js");

module.exports = {
  fields: {
    guid: {
      description: 'A unique identifier for this item.',
      descriptionExtra: 'Only used internally',
      type: 'string',
      default: uuid.v4()
    },
    slug: {
      description: 'How the item is stored on disk',
      type: 'string',
      default: DateTime.local().toFormat(config.fileDateFormat)
    },
    created: {
      type: 'string',
      description: 'Item creation timestamp',
      default: DateTime.local().toString()
    },
    updated: {
      type: 'string',
      description: 'Item update timestamp',
      default: DateTime.local().toString()
    },
    rss: {
      type: 'boolean',
      description: 'Include item in relevant local RSS feed'
    },
    listed: {
      type: 'boolean',
      description: 'Include item in this sections index page listing and archive listing'
    },
    public: {
      type: 'boolean',
      description: 'Visibility of item when visited directly'
    }
  }
}
