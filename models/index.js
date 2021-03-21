const debug = require('debug')('indieweb-express-site:models')
const {globalRecentIndex, globalRecentFeed} = require('./utils/recent')
const {globalArchiveIndex} = require('./utils/archive')
const {modelsArray, models} = require('./types')
const page = require('./page.model')


module.exports = {globalRecentIndex, globalRecentFeed, globalArchiveIndex, page, modelsArray, ...models}
