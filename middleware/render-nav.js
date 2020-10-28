const nav = require('../nav')

const renderNav = function (req,res,next) {
  res.locals.nav = nav(req.params.id);
  next();
}

module.exports = renderNav;
