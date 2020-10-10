const is = require('is_js')
const markdown = require('../../drivers/markdown')
const matter = require('gray-matter')

const listBase = async (cache, limit=20) => {
  try {
    if (!cache) throw new Error('You must supply all params')
    if (is.not.object(cache)) throw new Error('cache must be an object')
    

    function compare(a, b) {
      if (a > b) return 1;
      if (b > a) return -1;
    
      return 0;
    }

    let keyList = cache.keys().slice().sort(compare)

    return keyList


  } catch (error) {
    // TODO Add to error log
    return Promise.reject(error)
  }
}

module.exports = listBase
