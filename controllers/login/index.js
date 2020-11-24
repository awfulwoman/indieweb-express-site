
const debug = require('debug')('sonniesedge:controllers:login')
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const urlencodedParser = bodyParser.urlencoded({ extended: true });
const passport = require('passport')
const userList = require('../../config.users')
const router = express.Router()
const config = require('../../config')
const constructOauth = require('../../utilities/construct-oauth-callback')
const renderNav = require('../../middleware/render-nav')

// Default login page
router.get(config.siteLoginPath(), renderNav, function(req, res){
  res.render('auth/method', {
    data: {title: 'Choose authentication method'},
    content: null,
    siteLoginPath: config.siteLoginPath()
  })
})

// Twitter authentication route
router.get(`${config.siteLoginPath()}/twitter`, passport.authenticate('twitter'))
router.get(`${config.siteLoginPath()}/github`, passport.authenticate('github'))
// app.get('/email', passport.authenticate('easypassword'))

// Twitter oauth callback
router.get(constructOauth.oaPath('twitter'), passport.authenticate('twitter', {successRedirect : `req.query ? req.query.original : '/'`, failureRedirect: '/youdidntsaythemagicword'}))

// Github oauth callback
// router.get(constructOauthCallbackPath('github'), passport.authenticate('github', { failureRedirect: '/' }), function(req, res) {
//   // Successful authentication, redirect home.
//   res.redirect('/')
// });

// Destroy logged-in session
router.get('/end',
  function(req, res){
    req.session.destroy(function () {
      res.redirect('/');
    });
  }
);


module.exports = router;
