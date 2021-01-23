const debug = require('debug')('indieweb-express-site:controllers:feed:types:json')
const asyncHandler = require('express-async-handler')
const generateBaseFeed = require('../base')
const AppError = require('../../../utilities/app-error')

const jsonGet = (model, options) => {
  options || (options = {});
  return asyncHandler(async (req, res, next) => {
    try {
      if (!model) throw new Error('model must be supplied')
      let results = await generateBaseFeed(model)
      res.contentType('application/json')
      res.send(results.json1())
    } catch (error) {
      throw new AppError('404', 'JSON feed not found', error)
    }
  })
}

module.exports = jsonGet
