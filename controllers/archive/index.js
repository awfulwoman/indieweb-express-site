const debug = require('debug')('sonniesedge:controllers:archive')
const asyncHandler = require('express-async-handler')
const ErrorHandler = require('../../utilities/error-handler')
const is = require('is_js')
const { DateTime } = require('luxon')
const arrayToArchive = require('../../utilities/array-to-archive')
const monthNameToMonthNumber = require('../../utilities/month-name-to-month-number')

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
      if (req.params.month) incomingDate.month = monthNameToMonthNumber(req.params.month)
      if (req.params.day) incomingDate.day = parseInt(req.params.day)

      // Check converted values
      if (is.existy(incomingDate.year) && is.not.integer(incomingDate.year)) throw new Error('year could not be converted to an integer')
      if (is.existy(incomingDate.month) && is.not.integer(incomingDate.month)) throw new Error(`month could not be converted to an integer. Got ${incomingDate.month}`)
      if (is.existy(incomingDate.day) && is.not.integer(incomingDate.day)) throw new Error('day could not be converted to an integer')

      let archiveResults = model.globalArchiveIndex ? await model.globalArchiveIndex(incomingDate, false) : await model.archiveIndex(incomingDate, false)

      // Build human-readable datestring
      let dateString = 'yyyy'
      if (incomingDate.month) dateString = 'LLLL yyyy'
      if (incomingDate.day) dateString = 'd LLLL yyyy'

      let humanDateTime = DateTime.fromObject(incomingDate).toFormat(dateString)
      let resultsObj = arrayToArchive(archiveResults)

      res.render(options.template || 'archive/default', {
        data: { title: `Archive results for ${humanDateTime}` },
        children: resultsObj
      }, (error, html) => {
        if(error) {
          res.send(`<img src="/error.gif">`)
          throw new Error(error)
        } else {
            res.send(html);
        }
      })
    } catch (error) {
      throw new ErrorHandler('404', `Could not find any archive entries for ${humanDateTime}.`, error)
    }
  })
}

module.exports = controllerArchiveHelper
