const renderBuildTime = function (req,res,next) {
  res.locals.buildTime = process.env['LAST_DEPLOY'] ? process.env['LAST_DEPLOY'] : 'unknown'
  next()
}

module.exports = renderBuildTime
