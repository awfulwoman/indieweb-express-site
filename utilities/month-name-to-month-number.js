const debug = require('debug')('indieweb-express-site:utilities:monthNameToMonthNumber')
const is = require('is_js')
const months = require('./months')


const monthNameToMonthNumber = (monthName) => {
  debug(monthName)
  const parsed = parseInt(monthName)
  if (is.integer(parseInt(parsed))) {
    return parsed
  }

  const dt = months(monthName)
  return dt
}

module.exports = monthNameToMonthNumber
