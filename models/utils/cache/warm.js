const debug = require('debug')('sonniesedge:models:utils:cache:warm')
const is = require('is_js')
const path = require('path')
const fg = require('fast-glob')
const naturalSort = require('javascript-natural-sort')
const config = require('../../../config')
const ErrorHandler = require('../../../utilities/error-handler')
const read = require('../read')
const alias = require('../alias')


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

module.exports = warm
