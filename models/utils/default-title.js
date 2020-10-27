const debug = require('debug')('sonniesedge:models:utils:defaultTitle')
const { DateTime } = require('luxon')

const defaultTitle = (datestamp) => {
  let parsedDate = DateTime.local().toLocaleString({ weekday: 'short', month: 'short', day: '2-digit', hour: '2-digit', minute: '2-digit' });
  return `${parsedDate}`
}

module.exports = defaultTitle
