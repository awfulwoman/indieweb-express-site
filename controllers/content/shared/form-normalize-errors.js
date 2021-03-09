const { validationResult } = require('express-validator')
const debug = require('debug')('indieweb-express-site:utilities:formNormalizeErrors')

const normalizeFormErrors = (req) => {
  try {
    let errors = validationResult(req)
          
    let form_errors = {}

    for (const error of errors.array()) {
      let replacedParam = error.param.replace('.', '_')
      form_errors[replacedParam] = error.msg
    }

    return form_errors
  } catch (error) {
    debug(error)
    throw error
  }
}

module.exports = normalizeFormErrors
