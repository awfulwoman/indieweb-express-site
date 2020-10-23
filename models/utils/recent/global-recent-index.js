
const debug = require('debug')('sonniesedge:model:utils:recent:globalRecentIndex')
const _recent = require('./_recent')

const globalRecentIndex = async (limit=20) => {
  debug('globalRecentIndex called')
  debug(_recent)
  try {
    let results = await _recent()
    return results.slice(0, limit)
  } catch (error) {
    debug(error)
    throw error
  }
}

module.exports = globalRecentIndex
