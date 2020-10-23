const debug = require('debug')('sonniesedge:controllers:utils:archive:getMonth')
const asyncHandler = require('express-async-handler')
const ErrorHandler = require('../../../utilities/error-handler')
const is = require('is_js')
const path = require('path')

// READ
const getMonth = (model, options) => {
  options || (options = {});
  return asyncHandler(async (req, res, next) => {
    try {
      res.send('get Year archive')
    } catch (error) {
      debug(error)
      throw new ErrorHandler('404', 'Could not find this content. Have you tried looking under the sofa?')
    }
  })
}

module.exports = getMonth
