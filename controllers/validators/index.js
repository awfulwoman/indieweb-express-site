const { body } = require('express-validator')

module.exports = [
  body('place[latlng]').optional({checkFalsy: true}).isLatLong(),
  body('bookmark_of').optional({checkFalsy: true}).isURL(),
  body('like_of').optional({checkFalsy: true}).isURL(),
  body('quote_of').optional({checkFalsy: true}).isURL(),
  body('repost_of').optional({checkFalsy: true}).isURL(),
  body('reply_to').optional({checkFalsy: true}).isURL()
]
