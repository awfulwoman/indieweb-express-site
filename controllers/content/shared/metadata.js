const debug = require('debug')('indieweb-express-site:controllers:content:shared:metadata')
const is = require('is_js')
const { DateTime } = require('luxon')
const uuid = require('uuid')

const config = require('../../../config')

const metadata = (data, options = {}) => {
  let renderMessages = []

  try {

    debug('metadata: ')
    debug(data)
    let tempCurrentDate = DateTime.local().toUTC()

    if (!data.created) {
      data.created = tempCurrentDate.toISO()
      renderMessages.push(`No created date so added ${data.created}`)
    }
    if (!data.modified) {
      data.modified = tempCurrentDate.toISO()
      renderMessages.push(`No modified date so added ${data.modified}`)
    }
    if (!data.guid) {
      data.guid = uuid.v4()
      renderMessages.push(`No guid so added ${data.guid}`)
    }

    debug('new metadata: ')
    debug(data)

    return {
      messages: renderMessages,
      data: data
    }
  } catch (error) {
    throw error
  }
}

module.exports = metadata
