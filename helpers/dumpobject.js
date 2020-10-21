const debug = require('debug')('sonniesedge:helpers:dumpObject');
const hljs = require('highlight.js');

const dumpObject = function(context) {
  try {
    let stringified = JSON.stringify(context, null, '  ');
    let output = hljs.highlight('json', stringified)
    return output.value
  } catch (error) {
    debug(error)
    throw error
  }
}

module.exports = dumpObject;
