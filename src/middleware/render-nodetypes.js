const getNodeTypes = require('../utilities/getnodetypes');

const renderNodeTypes = function (req,res,next) {
  res.locals.nodeTypes = getNodeTypes();
  next();
}

module.exports = renderNodeTypes;
