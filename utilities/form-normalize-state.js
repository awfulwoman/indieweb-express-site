const debug = require('debug')('sonniesedge:utilities:formNormalizeState')
const is = require('is_js')
const flatten = require('flat')
const qs = require('qs')
const merge = require('deepmerge')

const combineMerge = (target, source, options) => {
  const destination = target.slice()

  source.forEach((item, index) => {
      if (typeof destination[index] === 'undefined') {
          destination[index] = options.cloneUnlessOtherwiseSpecified(item, options)
      } else if (options.isMergeableObject(item)) {
          destination[index] = merge(target[index], item, options)
      } else if (target.indexOf(item) === -1) {
          destination.push(item)
      }
  })
  return destination
}

const normalizeFormState = (request) => {
  try {



    debug('FILES:')
    debug(request.files)
    debug('expanded name: ', qs.parse(request.files))

    debug('BODY:')
    debug(request.body)

    let tempBodyObj = {}
    
    for (const file of request.files) {
      let result = qs.parse(`${file['fieldname']}=${file['originalname']}`)
      tempBodyObj = merge(tempBodyObj, result)
    }

    request.body.photos = merge(request.body.photos, tempBodyObj.photos, { arrayMerge: combineMerge })

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

        // A simple array of strings or integers
        if (!isComplexArrayOfObjects) {
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
