const debug = require('debug')('sonniesedge:models:base')
const is = require('is_js')
const config = require('../../config')
const path = require('path')
// const markdown = require('../../drivers/markdown')
// const matter = require('gray-matter')
const naturalSort = require('javascript-natural-sort')
const fg = require('fast-glob');
const read = require('./read')


const list = async (cache, limit=20) => {
  try {
    if (!cache) throw new Error('You must supply all params')
    if (is.not.object(cache)) throw new Error('cache must be an object')

    let keyList = cache.keys().slice().sort(naturalSort).reverse()

    let results = []
    for (let item = 0; item < keyList.length; item++) {
      results.push(cache.get(keyList[item]))
    }
    return results

  } catch (error) {
    // TODO Add to error log
    return Promise.reject(error)
  }
}

const warm = async (cache, type) => {
  debug(`Warming ${type} cache.`)

  try {
    if (!cache || !type) throw new Error('You must supply all params')
    if (is.not.object(cache)) throw new Error('cache must be an object')
    if (is.not.string(type)) throw new Error('type must be a string')

    let result = await fg(path.join(config.contentRoot, type, '*'), { onlyDirectories: true })

    for (let index = 0; index < result.length; index++) {
      await read(type, cache, path.basename(result[index]))
    }
  } catch(error) {
    // TODO Add to error log
    return Promise.reject(error)
  }
}

module.exports = {list, warm}
