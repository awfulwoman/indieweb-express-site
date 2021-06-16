const debug = require('debug')('indieweb-express-site:helpers:formatDate')
const { DateTime } = require('luxon')
const isISODate = require('is-iso-date')

const formatDate = function (incomingIsoDate, format) {
  try {
    // debug(incomingIsoDate)
    // debug(format)

    if (!incomingIsoDate) throw new Error('No date specified!')
    if (!format) throw new Error('No date format specified!')
    if (!isISODate(incomingIsoDate)) throw new Error('Is not an ISO date!')

    let tempISODate = DateTime.fromISO(incomingIsoDate)
    let tempFormattedDate = tempISODate.toFormat(format)

    return tempFormattedDate
  } catch (error) {
    throw error
  }
}

module.exports = formatDate
