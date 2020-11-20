const config = require('../config')

const checkAuthentication = function (req,res,next) {
  if(req.isAuthenticated() || process.env['DEBUG']){
      next();
  } else{
    res.redirect(config.siteLoginPath());
  }
}

module.exports = checkAuthentication;
