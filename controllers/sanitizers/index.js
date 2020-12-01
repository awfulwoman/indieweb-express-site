const debug = require('debug')('sonniesedge:controllers:sanitizers')
const { body } = require('express-validator')

module.exports = [
  body('tags').optional({checkFalsy: true}).customSanitizer(value => {
    debug('tags')
    return value.split(',').map(tag => {
      return tag.trim()
    })
  }),
  body('content').optional({checkFalsy: true}).trim(),
  body('private').optional({checkFalsy: true}).toBoolean(),
  body('hide_from_feed').optional({checkFalsy: true}).toBoolean(),
  body('hide_from_index').optional({checkFalsy: true}).toBoolean()  
]
