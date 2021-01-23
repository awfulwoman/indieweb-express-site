const debug = require('debug')('indieweb-express-site:helpers:dumpObject')
const hljs = require('highlight.js')
const AppError = require('../utilities/app-error')

const dumpObject = function(context) {
  try {
    let stringified = JSON.stringify(context, null, '  ');
    let output = hljs.highlight('json', stringified)
    return output.value
  } catch (error) {
    throw error
  }
}

module.exports = dumpObject;
