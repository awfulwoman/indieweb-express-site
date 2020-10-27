const debug = require('debug')('sonniesedge:controllers:utils:feed:jsonGet')
const asyncHandler = require('express-async-handler')
const generateBaseFeed = require('./feed.base')
const ErrorHandler = require('../../../utilities/error-handler')

const jsonGet = (model, options) => {
  options || (options = {});
  return asyncHandler(async (req, res, next) => {
    try {
      if (!model) throw new Error('model must be supplied')
      let results = await generateBaseFeed(model)
      res.contentType('application/json')
      res.send(results.json1())
    } catch (error) {
      debug(error)
      throw new ErrorHandler('404', error)
    }
  })
}

module.exports = jsonGet
