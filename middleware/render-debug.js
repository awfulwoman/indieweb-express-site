const renderDebug = function (req,res,next) {
  res.locals.debug = process.env['DEBUG'] ? true : false
  next();
}

module.exports = renderDebug;
