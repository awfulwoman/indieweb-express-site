const debug = require('debug')('sonniesedge:helpers:dumpObject')
const hljs = require('highlight.js')
const ErrorHandler = require('../utilities/error-handler')

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
