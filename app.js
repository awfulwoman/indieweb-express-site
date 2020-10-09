require('dotenv').config()
const debug = require('debug')('sonniesedge:app');
const msg = require('debug')('sonniesedge:messages');
const error = require('debug')('sonniesedge:error');

const handleError = require('./middleware/errors')

// Express
const express = require('express');
const helmet = require('helmet');
const slash = require('express-slash');
// const logger = require('morgan');
// const querystring = require('querystring'); 
// const bodyParser = require('body-parser');
const renderUsers = require('./middleware/render-users');
const renderDebug = require('./middleware/render-debug');
// const renderNodeTypes = require('./middleware/render-nodetypes');

const notesController = require('./controllers/note.controller')

// Auth
const passport = require('passport');
const TwitterStrategy = require('passport-twitter').Strategy;
// const GitHubStrategy = require('passport-github2').Strategy;

// Handlebars
const hbs = require('express-handlebars');
const dumpObject = require('./helpers/dumpobject');
const hbsHelpers = require('handlebars-helpers')();

// App
const routesContent = require('./routes/content');
const routesLogin = require('./routes/login');
const routesAdmin = require('./routes/admin');
// const caching = require('./utilities/caching');
const config = require('./config');
const users = require('./models/user');

// Initialise Express 🎉
var app = express();

// Configure Helmet headers
app.use(helmet({contentSecurityPolicy: {
  directives: {
    defaultSrc: ["'self'"],
    scriptSrc: ["'self'"],
    styleSrc: ["'self'", "https://fonts.googleapis.com"],
    fontSrc: ["'self'", "https://fonts.gstatic.com"]
  }
}}));

// Set view engine to handlebars, using the .hbs extension
app.set('view engine', '.hbs');
// let demoUser = users.getAppUserObjFromAppId('DEMO');

app.engine('.hbs', hbs({
  helpers: {...hbsHelpers, dumpObject},
  extname: '.hbs',
  defaultLayout: 'default'
}));

app.use(express.static(__dirname + '/public'));
app.set('view cache', process.env['DEBUG'] ? false : true);
app.use(require('express-session')({ secret: 'keyboard cat wirhfwenkwefjbwiurhiwuhjgjhgjhgjhgjhg', resave: true, saveUninitialized: true }));


// PASSPORT AUTHENTICATION
// -----------------------

// Build an oauth callback URL from env vars.
// This is stupidly complex
const constructOauthCallbackUrl = function(authsite){
  let result = `${config.siteProtocol}${config.siteDomain}${(config.sitePortExternal && config.sitePortExternal != 80 ? ':' + config.sitePortExternal : '')}/login/${authsite}/callback`;
  return result;
}

// Set options
const passportTwitterOptions = {
  consumerKey: process.env['TWITTER_CONSUMER_KEY'],
  consumerSecret: process.env['TWITTER_CONSUMER_SECRET'],
  callbackURL: constructOauthCallbackUrl('twitter')
};

// const passportGithubOptions = {
//   clientID: process.env['GITHUB_CLIENT_ID'],
//   clientSecret: process.env['GITHUB_CLIENT_SECRET'],
//   callbackURL: constructOauthCallbackUrl('github')
// }

// Use Twitter passport strategy
passport.use(new TwitterStrategy(passportTwitterOptions, function(token, tokenSecret, profile, cb) {
  debug('Someone trying to login with following Twitter profile: ', profile.username);
  let appUserProfile = users.getAppUserObjFromTwitterId(profile.id);
  return cb(null, appUserProfile);
}));

// Use Github passport strategy
// passport.use(new GitHubStrategy(passportGithubOptions, function(accessToken, refreshToken, profile, cb) {
//   // debug(passportGithubOptions)
//   // debug('Passport Github profile:', profile);
//   return cb(null, profile);
// }));

// Configure Passport authenticated session persistence.
passport.serializeUser(function(userAppObj, callback) {
  // serialize into session token - only need to store user ID in here
  callback(null, userAppObj.id);
});

passport.deserializeUser(function(userAppId, callback) {
  // deserialize out of session token and into a full user object
  callback(null, users.getAppUserObjFromAppId(userAppId));
});

// Initialize Passport in Express.
app.use(passport.initialize());

// Restore Passport's authentication state, if any, from the session.
app.use(passport.session());

// Make some info available to every render
app.use(renderUsers);
app.use(renderDebug);
// app.use(renderNodeTypes);

// LOGGING
// ------
// app.use(logger('dev'));

//
// ROUTES
// ------
//
app.use('/login', routesLogin); // Main routes
app.use('/admin', routesAdmin); // Main routes
app.use('/', notesController); // Main routes
app.use('/', routesContent); // Main routes
app.use(slash()); // Ensure trailing slashes are used


// 
// ERROR PAGES
// -----------
//

app.use((err, req, res, next) => {
  handleError(err, res);
});

app.use(function (req, res, next) {
  // 404, running at bottom of stack
  res.status(404).render('error', {
    status: 'error',
    statusCode: '404',
    message: 'Nothing to see here. Go home.'
  });
})

// Prep cache
// let warmedNodeCache = caching.prepNodeCache()
// let warmedNodeListCache = caching.prepNodeListCache(10)
// debug('Warming up node cache: %O', warmedNodeCache);
// debug('Warming up node list cache: %O', warmedNodeListCache);

// Boot app
app.listen(config.sitePort, function() {
  debug(`App booted and running at ${config.siteProtocol}${config.siteDomain}:${config.sitePort}`);
  debug('Twitter callback url:', constructOauthCallbackUrl('twitter'));
  debug('Github callback url:', constructOauthCallbackUrl('github'));
});
