const debug = require('debug')('sonniesedge:models:base')
const is = require('is_js')
const markdown = require('../../drivers/markdown')
const matter = require('gray-matter')
const naturalSort = require('javascript-natural-sort')

const list = async (cache, limit=20) => {
  debug('list.js called')
  try {
    if (!cache) throw new Error('You must supply all params')
    if (is.not.object(cache)) throw new Error('cache must be an object')

    let keyList = cache.keys().slice().sort(naturalSort).reverse()
    let temp = {}
    keyList.forEach(element => {
      temp[element] = matter(cache.get(element))
    })
    // debug(temp)
    return temp

  } catch (error) {
    // TODO Add to error log
    return Promise.reject(error)
  }
}

module.exports = {list}
