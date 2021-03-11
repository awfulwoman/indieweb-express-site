const debug = require('debug')('indieweb-express-site:controllers:content:shared:flattenFormErrors')

const normalizeFormErrors = (errors) => {
  try {
    const formErrors = {}

    for (const error of errors.array()) {
      let replacedParam = error.param.replace('.', '_')
      formErrors[replacedParam] = error.msg
    }

    return formErrors
  } catch (error) {
    debug(error)
    throw error
  }
}

module.exports = normalizeFormErrors
