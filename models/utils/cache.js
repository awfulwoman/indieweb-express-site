const debug = require('debug')('sonniesedge:models:utils:cache')
const is = require('is_js')
const config = require('../../config')
const path = require('path')
const ErrorHandler = require('../../utilities/error-handler')
const naturalSort = require('javascript-natural-sort')
const fg = require('fast-glob');
const read = require('./read')
const alias = require('./alias')

// TODO: Split into separate files

const list = async (modelCache, modelDir, options = {}) => {
  if (!options.limit) options.limit = 20

  try {
    if (!modelCache || !modelDir) throw new Error('You must supply all params')
    if (is.not.string(modelDir)) throw new Error('modelDir must be a string')
    if (is.not.object(modelCache)) throw new Error('cache must be an object')

    let keyList = modelCache.keys().slice().sort(naturalSort).reverse()
    let results = []

    for (let item = 0; item < keyList.length; item++) {
      let result = modelCache.get(keyList[item])

      if (result.data.private) continue
      if (options.honorHideFromIndex && result.data.hideFromIndex) continue
      if (options.honorHideFromFeed && result.data.hideFromFeed) continue

      result.dir = modelDir
      result.id = keyList[item]
      results.push(result)
    }
    results = results.slice(0, options.limit)
    return results

  } catch (error) {
    // TODO Add to error log
    debug(error)
    // if (error.code === 'ENOENT') { throw new ErrorHandler('404', 'File not found on disk') }
    throw error
  }
}

const warm = async (modelCache, type, modelAliasCache) => {
  let result = []
  try {
    if (!modelCache || !type) throw new Error('You must supply all params')
    if (is.not.object(modelCache)) throw new Error('cache must be an object')
    if (is.not.string(type)) throw new Error('type must be a string')

  } catch (error) {
    debug(`Failed to warm ${type} cache!`)
    throw error
  }

  try {
    result = await fg(path.join(config.contentRoot(), type, '*'), { onlyDirectories: true })
  } catch (error) {
    debug(`There was an error globbing for ${type}`)
    throw error
  }

  for (let index = 0; index < result.length; index++) {
    try {
      // debug(`Warming ${type}/${path.basename(result[index])}`)
      let readData = await read(type, modelCache, path.basename(result[index]))
      if (readData.data.slug && modelAliasCache) {
        await alias.set(modelAliasCache, path.basename(result[index]), readData.data.slug)
      }
    } catch (error) {
      debug(error)
      // debug(`Error warming /${type}/${path.basename(result[index])}. Skipping.%o`, error)
      // TODO Add to error log
      // throw error
    }
  }

}

module.exports = { list, warm }
