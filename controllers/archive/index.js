const debug = require('debug')('indieweb-express-site:controllers:archive')
const is = require('is_js')
const { DateTime } = require('luxon')
const arrayToArchive = require('../../utilities/array-to-archive')
const monthNameToMonthNumber = require('../../utilities/month-name-to-month-number')

const archiveController = async (model, range = {}, options = {}) => {
  try {
    const incomingDate = {}

    // Paramter checks
    // if (is.falsy(range.year)) {
    //   throw new Error('The year parameter must be supplied')
    // }
    if (is.existy(range.year) && is.not.integer(range.year) && is.not.string(range.year)) {
      throw new Error('The year parameter must be an integer or string')
    }
    if (is.existy(range.month) && is.not.integer(range.month) && is.not.string(range.month)) {
      throw new Error('The month parameter must be an integer or string')
    }
    if (is.existy(range.day) && is.not.integer(range.day) && is.not.string(range.day)) {
      throw new Error('The day parameter must be an integer or string')
    }

    debug(range.year)
    debug(range.month)
    debug(range.day)

    // Convert parameters to integers
    if (range.year) incomingDate.year = parseInt(range.year)
    if (range.month) incomingDate.month = monthNameToMonthNumber(range.month)
    if (range.day) incomingDate.day = parseInt(range.day)

    debug(incomingDate.year)
    debug(incomingDate.month)
    debug(incomingDate.day)

    // Check converted values
    if (is.existy(incomingDate.year) && is.not.integer(incomingDate.year)) throw new Error('year could not be converted to an integer')
    if (is.existy(incomingDate.month) && is.not.integer(incomingDate.month)) throw new Error(`month could not be converted to an integer. Got ${incomingDate.month}`)
    if (is.existy(incomingDate.day) && is.not.integer(incomingDate.day)) throw new Error('day could not be converted to an integer')

    const archiveResults = model.globalArchiveIndex ? await model.globalArchiveIndex(incomingDate, false) : await model.archiveIndex(incomingDate, false)

    // Build human-readable datestring
    let dateString = 'yyyy'
    if (incomingDate.month) dateString = 'LLLL yyyy'
    if (incomingDate.day) dateString = 'd LLLL yyyy'

    const humanDateTime = DateTime.fromObject(incomingDate).toFormat(dateString)
    const resultsObj = arrayToArchive(archiveResults)

    return {
      data: {
        title: `Archive results for ${humanDateTime}`
      },
      contentHtml: '',
      contentMarkdown: '',
      children: resultsObj
    }
  } catch (error) {
    throw new Error(error.message)
  }
}

module.exports = archiveController
