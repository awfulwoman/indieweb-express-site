const debug = require('debug')('sonniesedge:utilities:formNormalizeState')
const is = require('is_js')
const flatten = require('flat')

const normalizeFormState = (request) => {
  try {
    if (request.body) request = request.body

    // flatten object to keyed array
    let flattened = flatten(request, { delimiter: '_', safe: true })

    debug('Before converting arrays...')
    debug(flattened)

    debug('----------------------------')

    // convert any arrays to nicely-formatted strings
    for (const item in flattened) {
      // debug(item, flattened[item])
      // if (flattened.hasOwnProperty(item)) { // Item value has children (arrays or objects)
      if (is.array(flattened[item])) { // Value is an array
        // debug('item to flatten is array: ', item)

        // Is this complex or simple?
        let isComplexArrayOfObjects = false
        flattened[item].forEach(element => {
          if (is.object(element)) isComplexArrayOfObjects = true
        })

        // A complex array of objects
        if (!isComplexArrayOfObjects) {
          // Is a simple index array of values
          // debug('item to flatten is a simple indexed array', flattened[item])
          flattened[item] = flattened[item].join(', ')
        }

        if (isComplexArrayOfObjects) {
          for (const subitem in flattened[item]) {
            if (flattened[item].hasOwnProperty(subitem)) {
              for (const subsubitem in flattened[item][subitem]) {
                // debug('subsubitem: ', subsubitem)
                let thename = `${item}_${subitem}_${subsubitem}`
                // debug(thename, flattened[item][subitem][subsubitem])
                flattened[thename] = flattened[item][subitem][subsubitem]
              }
            }
          }
          delete flattened[item]
        }


        // }
      }
    }

    debug('Flattened: %o', flattened)

    return flattened
  } catch (error) {
    throw error
  }
}

module.exports = normalizeFormState
