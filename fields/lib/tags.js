const stringToArray = require('../../utilities/stringToArray')

module.exports = {
  description: 'Tag your content',
  formFieldRender: 'textfield',
  validation: {
    tags: {
      in: ['body'],
      isString: true,
      customSanitizer: {
        options: (value, { req, location, path }) => {
          return stringToArray(value)
        }
      }
    }
  }
}
