const debug = require('debug')('indieweb-express-site:controllers:syndication:store:siloFromUrl')
const {parseDomain, fromUrl, ParseResultType} = require('parse-domain')

const siloFromUrl = (url, options = {}) => {
  try {
    let siloTemp = parseDomain(fromUrl(url))
    debug(siloTemp)
    if (!siloTemp.type === ParseResultType.Listed) throw new Error('Silo is not valid')

    return siloTemp.domain
  } catch(error) {
    throw error
  }
}

module.exports = siloFromUrl
