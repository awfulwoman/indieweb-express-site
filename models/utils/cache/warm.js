const debug = require('debug')('indieweb-express-site:models:utils:cache:warm')
const is = require('is_js')
const path = require('path')
const fg = require('fast-glob')
const naturalSort = require('javascript-natural-sort')
const config = require('../../../config')
const AppError = require('../../../utilities/app-error')
const read = require('../read')
const alias = require('../alias')
const defaultTitle = require('../default-title')


const warm = async (modelCache, type, options = {}) => {
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
      let passThruOptions = {}
      if (options.defaultTitle) passThruOptions.defaultTitle = options.defaultTitle
      let readData = await read(type, modelCache, path.basename(result[index]), passThruOptions)

      if (readData.data.slug && options.modelAliasCache) {
        await alias.set(options.modelAliasCache, path.basename(result[index]), readData.data.slug)
      }

    } catch (error) {
      debug(error)
    }
  }

}

module.exports = warm
