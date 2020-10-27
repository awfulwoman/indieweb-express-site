const debug = require('debug')('sonniesedge:models:utils:cache:list')
const is = require('is_js')
const { DateTime } = require('luxon')
const path = require('path')
const fg = require('fast-glob')
const naturalSort = require('javascript-natural-sort')
const config = require('../../../config')
const ErrorHandler = require('../../../utilities/error-handler')
const read = require('../read')
const alias = require('../alias')

const list = async (modelCache, modelDir, options = {}) => {
  if (!options.limit) options.limit = 20

  try {
    if (!modelCache || !modelDir) throw new Error('You must supply all params')
    if (is.not.string(modelDir)) throw new Error('modelDir must be a string')
    if (is.not.object(modelCache)) throw new Error('cache must be an object')

    // We don't want to limit the results if we're specifying time ranges
    if (options.dateObj) delete options.limit

    let keyList = modelCache.keys().slice().sort(naturalSort).reverse()
    let results = []

    resultsLoop: 
      for (let item = 0; item < keyList.length; item++) {
        let result = modelCache.get(keyList[item])

        // Honour privacy settings
        if (result.data.private) continue
        if (options.honorHideFromIndex && result.data.hideFromIndex) continue
        if (options.honorHideFromFeed && result.data.hideFromFeed) continue

        // If a date range is specified, honour it
        if (options.dateObj) {

          let luxonDateTime = new DateTime(result.data.created).toObject()

          dateObjLoop: 
            for (const [key, value] of Object.entries(options.dateObj)) {
              switch (key) {
                case 'year':
                  if (luxonDateTime.year != value) break resultsLoop
                  break
                case 'month':
                  if (luxonDateTime.month != value) break resultsLoop
                  break
                case 'day':
                  if (luxonDateTime.day != value) break resultsLoop
                  break
                default:
                  break
              }
            }
        }

        // Everything is okay, so add extra metadata to the item object
        result.dir = modelDir
        result.id = keyList[item]
        results.push(result)
      }

    // Limit the results
    results = results.slice(0, options.limit)
    return results
  } catch (error) {
    // TODO Add to error log
    debug(error)
    // if (error.code === 'ENOENT') { throw new ErrorHandler('404', 'File not found on disk') }
    throw error
  }
}

module.exports = list
