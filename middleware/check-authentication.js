const config = require('../config')

const checkAuthentication = function (req, res, next) {
  // if (req.isAuthenticated() || process.env.DEBUG) {
  if (req.isAuthenticated()) {
    res.locals.debug = true
    next()
  } else {
    res.redirect(config.siteLoginPath() + '?redirectPath=' + req.route.path);
  }
}

module.exports = checkAuthentication
