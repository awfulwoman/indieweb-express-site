const debug = require('debug')('sonniesedge:utilities:formNormalizeState')
const is = require('is_js')
const flatten = require('flat')

const normalizeFormState = (request) => {
  try {

    if (request.body) request = request.body

    // Flatten object to keyed array
    // We use the "safe" option so that it doesn't mung up the child arrays
    let flattened = flatten(request, { delimiter: '_', safe: true }) 

    // The flatten library doesn't convert child arrays to the strings that we 
    // potentially need to send back to form, so we handle these manually

    // Convert any arrays to nicely-formatted strings
    for (const item in flattened) {
      if (is.array(flattened[item])) { // Value is an array

        // Determine if array is simple or complex
        let isComplexArrayOfObjects = false
        flattened[item].forEach(element => {
          if (is.object(element)) isComplexArrayOfObjects = true
        })

        // Flatten a simple array of strings or integers
        if (!isComplexArrayOfObjects) {
          flattened[item] = flattened[item].join(', ')
        }

        // Flatten a "complex" array of objects
        if (isComplexArrayOfObjects) {
          for (const subitem in flattened[item]) {
            if (flattened[item].hasOwnProperty(subitem)) {
              for (const subsubitem in flattened[item][subitem]) {
                let thename = `${item}_${subitem}_${subsubitem}`
                flattened[thename] = flattened[item][subitem][subsubitem]
              }
            }
          }
          delete flattened[item]
        }
      }
    }

    debug('Flattened: %o', flattened)

    return flattened
  } catch (error) {
    throw error
  }
}

module.exports = normalizeFormState
