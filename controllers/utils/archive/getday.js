const debug = require('debug')('sonniesedge:controllers:utils:archive:getDay')
const asyncHandler = require('express-async-handler')
const ErrorHandler = require('../../../utilities/error-handler')
const is = require('is_js')
const path = require('path')

// READ
const getDay = (model, options) => {
  options || (options = {});
  return asyncHandler(async (req, res, next) => {

    if (is.falsy(req.params.day) || is.falsy(req.params.month) || is.falsy(req.params.year)) 
      throw new Error('All parameters must be supplied')
    if (is.not.string(req.params.day)) throw new Error('day must be a number')
    if (is.not.string(req.params.month)) throw new Error('day must be a number or magic string')
    if (is.not.string(req.params.year)) throw new Error('day must be a number')

    try {
      res.render(options.template || 'page', {
        data: {title: 'View a specific day of the archive'},
        content: `${req.params.year}/${req.params.month}/${req.params.day}`
      })
    } catch (error) {
      debug(error)
      throw new ErrorHandler('404', 'Could not find this content. Have you tried looking under the sofa?')
    }
  })
}

module.exports = getDay
