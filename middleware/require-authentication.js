const config = require('../config')

const requireAuthentication = function (req, res, next) {
  // if (req.isAuthenticated() || process.env.DEBUG) {
  if (req.isAuthenticated()) {
    // res.locals.admin = true
    next()
  } else {
    res.redirect(config.siteLoginPath() + '?redirectPath=' + req.route.path);
  }
}

module.exports = requireAuthentication
