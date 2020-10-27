const debug = require('debug')('sonniesedge:controllers:utils:archive')
const asyncHandler = require('express-async-handler')
const ErrorHandler = require('../../../utilities/error-handler')
const is = require('is_js')
const { DateTime } = require('luxon')

const controllerArchiveHelper = (model, options) => {
  options || (options = {});
  return asyncHandler(async (req, res, next) => {
    try {
      let incomingDate = {}

      // Paramter checks
      if (is.falsy(req.params.year))
        throw new Error('year parameter must be supplied')
      if (is.existy(req.params.year) && is.not.integer(req.params.year) && is.not.string(req.params.year))
        throw new Error('year parameter must be an integer or string')
      if (is.existy(req.params.month) && is.not.integer(req.params.month) && is.not.string(req.params.month))
        throw new Error('month parameter must be an integer or string')
      if (is.existy(req.params.day) && is.not.integer(req.params.day) && is.not.string(req.params.day))
        throw new Error('day parameter must be an integer or string')

      // Convert parameters to integers
      if (req.params.year) incomingDate.year = parseInt(req.params.year)
      if (req.params.month) incomingDate.month = parseInt(DateTime.fromFormat(req.params.month, req.params.month.length === 3 ? 'LLL' : 'LLLL').toFormat('LL'))
      if (req.params.day) incomingDate.day = parseInt(req.params.day)

      // Check converted values
      if (is.existy(incomingDate.year) && is.not.integer(incomingDate.year)) throw new Error('year could be converted to an integer')
      if (is.existy(incomingDate.month) && is.not.integer(incomingDate.month)) throw new Error('month could be converted to an integer')
      if (is.existy(incomingDate.day) && is.not.integer(incomingDate.day)) throw new Error('day could not be converted to an integer')

      let archiveResults = model.globalArchiveIndex ? await model.globalArchiveIndex(incomingDate) : await model.archiveIndex(incomingDate)
      
      let dateString = 'yyyy'
      if (incomingDate.month) dateString = 'LLLL yyyy'
      if (incomingDate.day) dateString = 'd LLLL yyyy'

      let humanDateTime = DateTime.fromObject(incomingDate).toFormat(dateString)

      res.render(options.template || 'archive', {
        data: { title: `Archive results for ${humanDateTime}`},
        children: archiveResults
      })
    } catch (error) {
      debug(error)
      throw new ErrorHandler('404', `Could not find any archive entries for ${humanDateTime}.`)
    }
  })
}

module.exports = controllerArchiveHelper
