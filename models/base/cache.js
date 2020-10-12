const debug = require('debug')('sonniesedge:models:base:cache')
const is = require('is_js')
const config = require('../../config')
const path = require('path')
// const markdown = require('../../drivers/markdown')
// const matter = require('gray-matter')
const ErrorHandler = require('../../utilities/error-handler')
const naturalSort = require('javascript-natural-sort')
const fg = require('fast-glob');
const read = require('./read')


const list = async (cache, limit = 20) => {
  try {
    if (!cache) throw new Error('You must supply all params')
    if (is.not.object(cache)) throw new Error('cache must be an object')

    let keyList = cache.keys().slice().sort(naturalSort).reverse()

    keyList = keyList.slice(0, limit)

    let results = {}
    for (let item = 0; item < keyList.length; item++) {
      results[keyList[item]] = cache.get(keyList[item])
    }
    return results

  } catch (error) {
    // TODO Add to error log
    if (error.code === 'ENOENT') { throw new ErrorHandler('404', 'File note found on disk') }
    throw error
  }
}

const warm = async (cache, type) => {
  debug(`Warming ${type}`)
  let result = []
  try {

    if (!cache || !type) throw new Error('You must supply all params')
    if (is.not.object(cache)) throw new Error('cache must be an object')
    if (is.not.string(type)) throw new Error('type must be a string')

  } catch (error) {
    throw error
  }

  try {
    result = await fg(path.join(config.contentRoot, type, '*'), { onlyDirectories: true })
  } catch (error) {
    debug('error globbing')
    throw error
  }


  for (let index = 0; index < result.length; index++) {
    try {
      await read(type, cache, path.basename(result[index]))
    } catch (error) {
      debug('Error reading file. Skipping.', error)
      // TODO Add to error log
      // throw error
    }
  }

}

module.exports = { list, warm }
