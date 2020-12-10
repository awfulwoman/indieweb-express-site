const debug = require('debug')('sonniesedge:models:utils:sanitizeDate')
const chrono = require('chrono-node')
const { DateTime } = require('luxon')
const is = require('is_js')

const sanitizeDate = (dateInput) => {
  try {
    if (is.date(dateInput)) {
      return DateTime.fromJSDate(dateInput).toUTC().toISO()
    } else {
      return DateTime.fromJSDate(chrono.parseDate(dateInput)).toUTC().toISO()
    }
  } catch (error) {
    debug(dateInput)
    debug(error)
    return dateInput
  }
}

module.exports = sanitizeDate
