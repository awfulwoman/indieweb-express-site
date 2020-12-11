const debug = require('debug')('sonniesedge:utilities:formNormalizeState')
const is = require('is_js')
const flatten = require('flat')

const normalizeFormState = (request) => {
  try {
    if (request.body) request = request.body
    return flatten(request, {delimiter: '_', safe: true})
  } catch (error) {
    throw error
  }
}

module.exports = normalizeFormState
