const debug = require('debug')('indieweb-express-site:models:utils:alias')
const is = require('is_js')
const AppError = require('../../utilities/app-error')

const get = async function(aliasCache, alias) {
  try {
    if (is.not.string(alias)) throw new Error('alias must be a string') 
    if(!aliasCache.has(alias)) {
      debug(`No id for ${alias} found.`)
      return alias
    }
    let resolvedAlias = aliasCache.get(alias)
    debug(`Id of ${resolvedAlias} found for '${alias}' alias`)
    return resolvedAlias
  } catch (error) {
    throw error
  }

}

const set = async function(aliasCache, id, alias) {
  try {
    if (is.falsy(id) || is.falsy(alias)) throw new Error('You must supply all params')
    if (is.not.string(alias)) throw new Error('alias must be a string')
    if (is.not.string(id)) throw new Error('id must be a string')
    if (aliasCache.has(alias)) throw new Error(`The alias '${alias}' already exists`)
    // debug(`setting ${alias}`)
    aliasCache.set(alias, id)
  } catch (error) {
    throw error
  }
}

module.exports = {get, set}
