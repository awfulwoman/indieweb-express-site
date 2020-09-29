const dumpObject = function(context) {
  return JSON.stringify(context, null, '\t');
}

module.exports = dumpObject;
