const { validationResult } = require('express-validator')
const debug = require('debug')('sonniesedge:utilities:formNormalizeErrors')

const normalizeFormErrors = (req) => {

  let errors = validationResult(req)
        
  let form_errors = {}

  for (const error of errors.array()) {
    let replacedParam = error.param.replace('.', '_')
    form_errors[replacedParam] = error.msg
  }

  return form_errors
}

module.exports = normalizeFormErrors
