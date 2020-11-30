const { body } = require('express-validator')

module.exports = [
  body('content').optional({checkFalsy: true}),
  body('slug').optional({checkFalsy: true}),
  body('strapline').optional({checkFalsy: true}),
  body('place[latlng]').optional({checkFalsy: true}).isLatLong(),
  body('bookmark_of').optional({checkFalsy: true}).isURL(),
  body('like_of').optional({checkFalsy: true}).isURL(),
  body('quote_of').optional({checkFalsy: true}).isURL(),
  body('repost_of').optional({checkFalsy: true}).isURL(),
  body('reply_to').optional({checkFalsy: true}).isURL()
]
