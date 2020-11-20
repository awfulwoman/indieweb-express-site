const { body } = require('express-validator')
const tagsToArray = require('../../utilities/tags-to-array')

module.exports = [
  body('tags').customSanitizer((value) => {
    return tagsToArray(value)
  })
]
