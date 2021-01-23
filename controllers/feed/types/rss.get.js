const debug = require('debug')('indieweb-express-site:controllers:feed:types:rss')
const asyncHandler = require('express-async-handler')
const generateBaseFeed = require('../base')
const AppError = require('../../../utilities/app-error')

const rssGet = (model, options) => {
  options || (options = {});
  return asyncHandler(async (req, res, next) => {
    try {
      if (!model) throw new Error('model must be supplied')
      let results = await generateBaseFeed(model)
      res.contentType('application/rss+xml')
      res.send(results.rss2())
    } catch (error) {
      throw new AppError('404', 'RSS feed not found', error)
    }
  })
}

module.exports = rssGet
