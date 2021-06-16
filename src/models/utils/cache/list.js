const debug = require('debug')('indieweb-express-site:models:utils:cache:list')
const is = require('is_js')
const { DateTime } = require('luxon')
const naturalSort = require('javascript-natural-sort')

const list = async (modelCache, modelDir, options = {}) => {
  if (!options.limit) options.limit = 20
  // debug('options: ', options)
  if (options.dateObj) {
    // debug(`Limiting ${modelDir} results to: `, options.dateObj)
    // debug('-------------------------------------------')
  }

  if (!modelCache || !modelDir) throw new Error('You must supply all params')
  if (is.not.string(modelDir)) throw new Error('modelDir must be a string')
  if (is.not.object(modelCache)) throw new Error('cache must be an object')

  // We don't want to limit the results if we're specifying time ranges
  if (options.dateObj) delete options.limit

  // debug('options: ', options)

  let keyList = modelCache.keys().slice().sort(naturalSort).reverse()

  // debug(`${modelDir}: `, keyList.length)
  let results = []

  // if (keyList.length === 0) {
  //   debug('-------------------------------------------')
  //   return results
  // }

  resultsLoop:
  for (let item = 0; item < keyList.length; item++) {
    // debug('Item: ', keyList[item])
    let result = modelCache.get(keyList[item])

    // Honour privacy settings
    if (result.data.private) {
      // debug(`Private item ${modelDir}/${item.id}`)
      continue
    }
    if (options.honorHideFromIndex && result.data.hide_from_index) {
      // debug(`hiddenFromIndex item ${modelDir}/${item.id}`)
      continue
    }
    if (options.honorHideFromFeed && result.data.hide_from_feed) {
      // debug(`hiddenFromFeed item ${modelDir}/${item.id}`)
      continue
    }

    // If a date range is specified, honour it
    if (options.dateObj) {
      // debug(keyList[item])
      let luxonDateTime = DateTime.fromISO(result.data.created).toObject()
      // debug('luxonDateTime: ', luxonDateTime)
      dateObjLoop:
      for (const [key, value] of Object.entries(options.dateObj)) {
        switch (key) {
          case 'year':
            // debug('FILTERBYDATE: dateObj.year: ', value)
            // debug('FILTERBYDATE: luxonDateTime.year: ', luxonDateTime.year)
            if (luxonDateTime.year != value) {
              // debug('FILTERBYDATE: mismatch')
              continue resultsLoop
            }
            break
          case 'month':
            // debug('FILTERBYDATE: dateObj.month: ', value)
            // debug('FILTERBYDATE: luxonDateTime.month: ', luxonDateTime.month)
            if (luxonDateTime.month != value) {
              // debug('FILTERBYDATE: mismatch')
              continue resultsLoop
            }
            break
          case 'day':
            // debug('FILTERBYDATE: dateObj.day: ', value)
            // debug('FILTERBYDATE: luxonDateTime.day: ', luxonDateTime.day)
            if (luxonDateTime.day != value) {
              // debug('FILTERBYDATE: mismatch')
              continue resultsLoop
            }
            break
          default:
            break
        }
      }
    }
    results.push(result)
  }

  // Limit the results
  if (options.limit) results = results.slice(0, options.limit)

  return results
}

module.exports = list
