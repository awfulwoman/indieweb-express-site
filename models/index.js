const debug = require('debug')('indieweb-express-site:model')
const {globalRecentIndex, globalRecentFeed} = require('./utils/recent')
const {globalArchiveIndex} = require('./utils/archive')
const {modelsArray, models} = require('./types')


module.exports = {globalRecentIndex, globalRecentFeed, globalArchiveIndex, modelsArray, ...models}
