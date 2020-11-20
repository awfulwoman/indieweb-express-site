const { body } = require('express-validator')

module.exports = [
  body('place[latlng]').optional({checkFalsy: true}).isLatLong()
]
