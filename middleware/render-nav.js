const nav = require('../nav')
const debug = require('debug')('indieweb-express-site:middleware:renderNav')

const renderNav = function (req,res,next) {
  res.locals.nav = nav(req.originalUrl);
  next();
}

module.exports = renderNav;
