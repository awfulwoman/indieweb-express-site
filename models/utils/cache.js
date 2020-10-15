const debug = require('debug')('sonniesedge:model:utils:cache')
const is = require('is_js')
const config = require('../../config')
const path = require('path')
// const markdown = require('../../drivers/markdown')
// const matter = require('gray-matter')
const ErrorHandler = require('../../utilities/error-handler')
const naturalSort = require('javascript-natural-sort')
const fg = require('fast-glob');
const read = require('./read')

// TODO: Split into separate files

const list = async (cache, modelDir, limit = 20) => {
  try {
    if (!cache) throw new Error('You must supply all params')
    if (is.not.object(cache)) throw new Error('cache must be an object')

    let keyList = cache.keys().slice().sort(naturalSort).reverse()

    keyList = keyList.slice(0, limit)

    let results = []
    for (let item = 0; item < keyList.length; item++) {
      let result = cache.get(keyList[item])
      result.dir = modelDir
      result.id = keyList[item]
      results.push(result)
    }
    // debug(results)
    return results

  } catch (error) {
    // TODO Add to error log
    debug(error)
    if (error.code === 'ENOENT') { throw new ErrorHandler('404', 'File not found on disk') }
    throw error
  }
}

const warm = async (cache, type) => {
  let result = []
  try {
    if (!cache || !type) throw new Error('You must supply all params')
    if (is.not.object(cache)) throw new Error('cache must be an object')
    if (is.not.string(type)) throw new Error('type must be a string')

  } catch (error) {
    debug(`Failed to warm ${type} cache!`)
    throw error
  }

  try {
    result = await fg(path.join(config.contentRoot, type, '*'), { onlyDirectories: true })
  } catch (error) {
    debug(`There was an error globbing for ${type}`)
    throw error
  }

  for (let index = 0; index < result.length; index++) {
    try {
      // debug(`Warming ${type}/${path.basename(result[index])}`)
      await read(type, cache, path.basename(result[index]))
    } catch (error) {
      debug(error)
      // debug(`Error warming /${type}/${path.basename(result[index])}. Skipping.%o`, error)
      // TODO Add to error log
      // throw error
    }
  }

}

module.exports = { list, warm }
