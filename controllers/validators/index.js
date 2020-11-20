const { body } = require('express-validator')

module.exports = [
  // body('content').notEmpty().withMessage(`You need to write some content`),
  body('place.latlng').if(body('place.latlng').notEmpty()).isLatLong()
]
