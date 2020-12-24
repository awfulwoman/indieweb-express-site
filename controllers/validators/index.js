const { body } = require('express-validator')

// Base validations for all content types
// A field MUST be specified here or in the type controller if it is to be used
module.exports = [
  body('title').optional({checkFalsy: true}),
  body('content').optional({checkFalsy: true}),
  body('slug').optional({checkFalsy: true}),
  body('strapline').optional({checkFalsy: true}),
  body('place[latlng]').optional({checkFalsy: true}).isLatLong(),
  body('bookmark_of').optional({checkFalsy: true}).isURL(),
  body('like_of').optional({checkFalsy: true}).isURL(),
  body('quote_of').optional({checkFalsy: true}).isURL(),
  body('repost_of').optional({checkFalsy: true}).isURL(),
  body('reply_to').optional({checkFalsy: true}).isURL(),
  body('add_like').optional({checkFalsy: true}),
  body('images.*.alt').optional({checkFalsy: true}),
  body('images.*.file').optional({checkFalsy: true}),
  body('images.*.width').optional({checkFalsy: true}),
  body('images.*.height').optional({checkFalsy: true}),
  body('images.*.size').optional({checkFalsy: true}),
  body('guid').optional({checkFalsy: true})
]
