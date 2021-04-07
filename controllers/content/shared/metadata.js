const debug = require('debug')('indieweb-express-site:controllers:content:shared:metadata')
const { DateTime } = require('luxon')
const uuid = require('uuid')

const metadata = async (data, renderMessages = [], options = {}) => {
  const tempCurrentDate = DateTime.local().toUTC()

  if (!data.created) {
    data.created = tempCurrentDate.toISO()
    renderMessages.push(`Created: ${data.created}`)
  }

  // Change this on every modification
  data.modified = tempCurrentDate.toISO()
  renderMessages.push(`Modified: ${data.modified}`)

  if (!data.guid) {
    data.guid = uuid.v4()
    renderMessages.push(`GUID: ${data.guid}`)
  }

  return data
}

module.exports = metadata
