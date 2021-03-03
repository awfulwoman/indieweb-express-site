
const debug = require('debug')('indieweb-express-site:routes:auth')
const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const urlencodedParser = bodyParser.urlencoded({ extended: true })
const passport = require('passport')
const userList = require('../../config.users')
const router = express.Router()
const config = require('../../config')
const constructOauth = require('../../utilities/construct-oauth-callback')
const renderNav = require('../../middleware/render-nav')
const isValidPath = require('is-valid-path')

let redirectPath = '/'

// Default login page
router.get(config.siteLoginPath(), [renderNav], function(req, res){

  if (req.query && req.query.redirectPath) {
    if (isValidPath(req.query.redirectPath)) redirectPath = req.query.redirectPath
  }

  res.render('auth/method', {
    data: {title: 'Choose authentication method'},
    contentHtml: null,
    siteLoginPath: config.siteLoginPath()
  })
})

// Twitter authentication route
router.get(`${config.siteLoginPath()}/twitter`, passport.authenticate('twitter'))
router.get(`${config.siteLoginPath()}/github`, passport.authenticate('github'))
// app.get('/email', passport.authenticate('easypassword'))

// Twitter oauth callback
router.get(constructOauth.oaPath('twitter'), passport.authenticate('twitter', {failureRedirect: '/youdidntsaythemagicword'}), (req, res) => {
  console.log(req.query)
  res.redirect(redirectPath)
})

// Github oauth callback
router.get(constructOauth.oaPath('github'), passport.authenticate('github', { failureRedirect: '/youdidntsaythemagicword' }), (req, res) => {
  // Successful authentication, redirect home.
  console.log(req.query)
  res.redirect(redirectPath)
});

// Destroy logged-in session
router.get('/end',
  function(req, res){
    req.session.destroy(function () {
      res.redirect('/');
    });
  }
);


module.exports = router;
