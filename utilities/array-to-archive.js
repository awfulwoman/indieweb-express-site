const debug = require('debug')('sonniesedge:utilities:arrayToArchive')
const ErrorHandler = require('./error-handler')
const is = require('is_js')
const { DateTime } = require('luxon')

const arrayToArchive = (items) => {
  try {
    if(is.not.array(items)) throw new Error('items must be an array')
    let datedObj = {}
    for (const item of items) {
      if (is.falsy(item.data.created)) continue
      let itemYear = DateTime.fromISO(item.data.created).toFormat('yyyy')
      let itemMonth = DateTime.fromISO(item.data.created).toFormat('MM')
      let itemDay = DateTime.fromISO(item.data.created).toFormat('dd')
  
      if (!datedObj[itemYear]) datedObj[itemYear] = {}
      if (!datedObj[itemYear][itemMonth]) datedObj[itemYear][itemMonth] = {}
      if (!datedObj[itemYear][itemMonth][itemDay]) datedObj[itemYear][itemMonth][itemDay] = []
      
      datedObj[itemYear][itemMonth][itemDay].push(item)
    }
    return datedObj
  } catch (error) {
    throw new Error(`Could not convert index results to an array object.`)
  }
}

module.exports = arrayToArchive
