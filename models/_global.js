const { string, boolean } = require("is_js");
const config = require('../config')
const uuid = require('uuid')
const DateTime = require('luxon').DateTime

module.exports = {
  fields: {
    guid: {
      type: 'string',
      description: 'Item GUID',
      descriptionExtra: 'A globally unique identifier for this item. Only used internally',
      default: uuid.v4()
    },
    created: {
      type: 'string',
      description: 'Created',
      descriptionExtra: 'The item creation time and date',
      default: DateTime.local().toString()
    },
    modified: {
      type: 'string',
      description: 'Updated',
      descriptionExtra: 'The item update time and date',
      default: DateTime.local().toString()
    },
    exclude_from_rss: {
      type: 'boolean',
      description: 'Include in RSS',
      descriptionExtra: 'Whether the item is included in the item type RSS feed',
      default: true
    },
    exclude_from_listings: {
      type: 'boolean',
      description: 'Include on listings',
      descriptionExtra: 'Whether the item is included on the sites listings and archives',
      default: true
    },
    private: {
      type: 'boolean',
      description: 'Public',
      descriptionExtra: 'Whether the item is available when the URL is visited directly',
      default: true
    }
  }
}
