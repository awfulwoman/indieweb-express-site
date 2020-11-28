const debug = require('debug')('sonniesedge:utilities:formNormalizeState')
const is = require('is_js')

const normalizeFormState = (request) => {
  try {
    let form_state = {}

    for (const key in request.body) {
      if (request.body.hasOwnProperty(key)) {        // debug(key, req.body[key])
        if (is.object(request.body[key])) {
          for (const keyChild in request.body[key]) {
            form_state[`${key}_${keyChild}`] = request.body[key][keyChild]
          }
        } else {
          form_state[key] = request.body[key]
        }
      }
    }

    return form_state
  } catch (error) {
    debug(error)
    throw error
  }
}

module.exports = normalizeFormState
