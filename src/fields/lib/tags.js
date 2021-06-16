const stringToArray = require('../../utilities/stringToArray')

module.exports = {
  description: 'Tag your content',
  formFieldRender: 'textfield',
  validation: {
    tags: {
      in: ['body'],
      optional: { options: { nullable: true, checkFalsy: true } },
      isString: true,
      customSanitizer: {
        options: (value) => {
          return stringToArray(value)
        }
      }
    }
  }
}
