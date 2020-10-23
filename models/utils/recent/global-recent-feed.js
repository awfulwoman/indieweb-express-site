const debug = require('debug')('sonniesedge:model:utils:recent:globalRecentFeed')
const _recent = require('./_recent')

const globalRecentFeed = async (limit=20) => {
  try {
    let results = await _recent()
    return results.slice(0, limit)
  } catch (error) {
    debug(error)
    throw error
  }
}

module.exports = globalRecentFeed
