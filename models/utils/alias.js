const debug = require('debug')('sonniesedge:models:utils:alias')
const is = require('is_js')

const get = async function(aliasCache, alias) {
  try {
    debug('called')
    if (is.not.string(alias)) throw new Error('alias must be a string') 
    if(!aliasCache.has(alias)) {
      debug(`No id for ${alias} found.`)
      return alias
    }
    let aliasEmitted = aliasCache.get(alias)
    debug('alias emitted: ', aliasEmitted)
    return aliasEmitted
  } catch (error) {
    throw error
  }

}

const set = async function(aliasCache, id, alias) {
  // debug(aliasCache, id, alias)
  try {
    if (is.falsy(id) || is.falsy(alias)) throw new Error('You must supply all params')
    if (is.not.string(alias)) throw new Error('alias must be a string')
    if (is.not.string(id)) throw new Error('id must be a string')
    if (aliasCache.has(alias)) throw new Error('alias already exists')
    debug(`setting ${alias}`)
    aliasCache.set(alias, id)
  } catch (error) {
    throw error
  }
}

module.exports = {get, set}
