const config = require('../config');

const getNodeTypeScaffold = function(nodeType, errorMessages) {
  if (typeof(nodeType) === 'string' && nodeType.length > 0) {
    let result = config.nodeTypes.filter(item => {
      return item.id === nodeType
    });


    return JSON.parse(JSON.stringify(result[0]));
  } else {
    return false
  }
}

module.exports = getNodeTypeScaffold;
