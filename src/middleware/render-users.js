const renderUsers = function (req,res,next) {
  res.locals.user = req.user;
  next();
}

module.exports = renderUsers;
