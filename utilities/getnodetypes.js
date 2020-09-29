

const config = require('../config');
const e = require('express');

const getNodeTypes = function() {
  let result = []
  config.nodeTypes.forEach(nodeType => {
    let nodeDetails = {};
    nodeDetails.id = nodeType.id;
    nodeDetails.machineSingular = nodeType.machineSingular;
    nodeDetails.machinePlural = nodeType.machinePlural;
    nodeDetails.englishSingular = nodeType.englishSingular;
    nodeDetails.englishPlural = nodeType.englishPlural;
    result.push(nodeDetails);
  });

  return result;
}

module.exports = getNodeTypes;
