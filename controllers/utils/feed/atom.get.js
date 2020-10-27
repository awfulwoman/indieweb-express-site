const debug = require('debug')('sonniesedge:controllers:utils:feed:atomGet')
const asyncHandler = require('express-async-handler')
const generateBaseFeed = require('./feed.base')
const ErrorHandler = require('../../../utilities/error-handler')

const atomGet = (model, options) => {
  options || (options = {});
  return asyncHandler(async (req, res, next) => {
    try {
      let results = await generateBaseFeed(model)
      res.contentType('application/json')
      res.send(results.atom1())
    } catch (error) {
      debug(error)
      throw new ErrorHandler('404', error)
    }
  })
}

module.exports = atomGet
