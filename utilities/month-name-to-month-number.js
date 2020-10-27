const debug = require('debug')('sonniesedge:utilities:monthNameToMonthNumber')
const ErrorHandler = require('./error-handler')
const is = require('is_js')
const month = require('month')

const monthNameToMonthNumber = (monthName) => {
  let parsed = parseInt(monthName)
  if (is.integer(parseInt(parsed))) {
    return parsed
  }

  let dt = month(monthName)
  return parseInt(dt)
}

module.exports = monthNameToMonthNumber
