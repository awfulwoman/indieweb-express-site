const isAdmin = function (req, res, next) {
  if (req.isAuthenticated()) { // we're only got one suer, and that user is the admin so...
    res.locals.admin = true
    next()
  } else {
    next()
  }
}

module.exports = isAdmin
