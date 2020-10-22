const debug = require('debug')('sonniesedge:controllers:utils:content:rssGet')
const asyncHandler = require('express-async-handler')
const generateBaseFeed = require('./feed.global')

const rssGet = (model, options) => {
  options || (options = {});
  return asyncHandler(async (req, res, next) => {
    try {
      if (!model) throw new Error('model must be supplied')
      let results = await generateBaseFeed(model)
      res.contentType('application/rss+xml')
      res.send(results.rss2())
    } catch (error) {
      debug(error)
      throw new ErrorHandler('404', error)
    }
  })
}

module.exports = rssGet
