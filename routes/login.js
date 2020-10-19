
const debug = require('debug')('sonniesedge:login');
const msg = require('debug')('sonniesedge:messages');
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const urlencodedParser = bodyParser.urlencoded({ extended: true });
const passport = require('passport');
const userList = require('../config.users');

app.enable('strict routing');
const router = express.Router({
    caseSensitive: app.get('case sensitive routing'),
    strict: app.get('strict routing')
});

// Default login page
router.get('/', function(req, res){
  res.render('auth/login', {
    data: {title: 'Log in'},
    username: req.query.username || null,
    content: req.query.message || null
  });
});

// Not really protection, but more to put people off
router.post('/method', urlencodedParser, function(req, res){
  if(userList.some(user => user.userName === req.body.username)) {
    res.render('auth/method', {
      username: req.body.username,
      data: {title: 'Choose authentication method'},
      content: null,
    });
  } else {
    const query = querystring.stringify({
      'username': req.body.username
    });
    res.redirect('/?' + query);
  }
});

// Twitter authentication route
router.get('/twitter', passport.authenticate('twitter'));
router.get('/github', passport.authenticate('github'));
// app.get('/email', passport.authenticate('easypassword'));

// Twitter oauth callback
router.get('/twitter/callback', passport.authenticate('twitter', {successRedirect : '/admin', failureRedirect: '/youdidntsaythemagicword'}));

// Github oauth callback
router.get('/github/callback', passport.authenticate('github', { failureRedirect: '/' }), function(req, res) {
  // Successful authentication, redirect home.
  res.redirect('/');
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
