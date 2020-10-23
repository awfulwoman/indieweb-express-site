const debug = require('debug')('sonniesedge:controllers:utils:archive')

const getDay = require('./getday')
const getMonth = require('./getmonth')
const getYear = require('./getyear')

module.exports = {getDay, getMonth, getYear}
