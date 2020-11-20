const { body } = require('express-validator')

module.exports = [
  body('tags').optional({checkFalsy: true}).toArray(),
  body('private').optional({checkFalsy: true}).toBoolean(),
  body('hide_from_feed').optional({checkFalsy: true}).toBoolean(),
  body('hide_from_index').optional({checkFalsy: true}).toBoolean()  
]
