const renderDebug = (req, res, next) => {

  if(req.header('x-debug') === process.env['DEBUG_TOKEN'] || process.env['DEBUG'] === true) {
    res.locals.debug = true
  }

  next()
}

module.exports = renderDebug
