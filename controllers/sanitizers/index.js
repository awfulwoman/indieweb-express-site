const debug = require('debug')('sonniesedge:controllers:sanitizers')
const { body } = require('express-validator')
const is = require('is_js')

module.exports = [
  body('tags').customSanitizer(value => {
    debug('Tags:', value)
    if (is.falsy(value)) return false
    return value.split(',').map(tag => {
      return tag.trim()
    })
  }).optional({checkFalsy: true}),
  body('content').optional({checkFalsy: true}).trim().stripLow(true),
  body('private').optional({checkFalsy: true}).toBoolean(),
  body('hide_from_feed').optional({checkFalsy: true}).toBoolean(),
  body('hide_from_index').optional({checkFalsy: true}).toBoolean(),
  body('add_like').optional({checkFalsy: true}).toBoolean()
]
