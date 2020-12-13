const debug = require('debug')('sonniesedge:utilities:formNormalizeState')
const is = require('is_js')
const flatten = require('flat')

const normalizeFormState = (request) => {
  try {
    if (request.body) request = request.body

    // flatten object to keyed array
    let flattened = flatten(request, {delimiter: '_', safe: true})

    // convert any arrays to nicely-formatted strings
    for (const item in flattened) {
      if (flattened.hasOwnProperty(item)) {
        if (is.array(flattened[item])) flattened[item] = flattened[item].join(', ')
      }
    }

    debug('Flattened content: %o', flattened.content)

    return flattened
  } catch (error) {
    throw error
  }
}

module.exports = normalizeFormState
