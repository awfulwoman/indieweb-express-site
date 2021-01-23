const debug = require('debug')('indieweb-express-site:models:utils:cache:clearItem')
const is = require('is_js')

const clearItem = async (modelCache, id, options = {}) => {

  try {
    if (!modelCache || !id) throw new Error('You must supply all params')
    if (is.not.string(id)) throw new Error('id must be a string')

    modelCache.del(id)
    debug(`Reset cache for ${id}.`)
    
  } catch (error) {
    throw error
  }
}

module.exports = clearItem
