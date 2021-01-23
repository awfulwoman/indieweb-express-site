const debug = require('debug')('indieweb-express-site:utilities:monthNameToMonthNumber')
const AppError = require('./app-error')
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
