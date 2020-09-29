const checkAuthentication = function (req,res,next) {
  if(req.isAuthenticated()){
      next();
  } else{
    res.redirect("/login");
  }
}

module.exports = checkAuthentication;
