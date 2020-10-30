const nav = require('../nav')
const debug = require('debug')('sonniesedge:middleware:renderNav')

const renderNav = function (req,res,next) {
  res.locals.nav = nav(req.originalUrl);
  next();
}

module.exports = renderNav;
