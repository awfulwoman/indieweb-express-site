const debug = require('debug')('indieweb-express-site:constructOauthCallback')
const config = require('../config')

const oaUrl = function (strategy) {
  let result = `${config.siteProtocol()}${config.siteDomain()}${(config.sitePortExternal() && config.sitePortExternal() != 80 ? ':' + config.sitePortExternal() : '')}/oauth/${strategy}/callback`;
  return result;
}

const oaPath = function (strategy) {
  let result = `/oauth/${strategy}/callback`;
  return result;
}

module.exports = {oaPath, oaUrl}
