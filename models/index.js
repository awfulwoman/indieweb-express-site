const debug = require('debug')('sonniesedge:model')
const {globalRecentIndex, globalRecentFeed} = require('./utils/recent')
const {globalArchiveIndex} = require('./utils/archive')

module.exports = {globalRecentIndex, globalRecentFeed, globalArchiveIndex}
