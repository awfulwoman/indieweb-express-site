const is = require('is_js')
const markdown = require('../../drivers/markdown')
const matter = require('gray-matter')
const naturalSort = require('javascript-natural-sort')

const listBase = async (cache, limit=20) => {
  try {
    if (!cache) throw new Error('You must supply all params')
    if (is.not.object(cache)) throw new Error('cache must be an object')

    let keyList = cache.keys().slice().sort(naturalSort).reverse()

    return cache.mget(keyList)

  } catch (error) {
    // TODO Add to error log
    return Promise.reject(error)
  }
}

module.exports = listBase
