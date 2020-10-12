require('dotenv').config()
const debug = require('debug')('sonniesedge:app');
const msg = require('debug')('sonniesedge:messages');
const error = require('debug')('sonniesedge:error');
const path = require('path')
const config = require('./config');
const models = require('./models')
const cacheTools = require('./utilities/cache-tools')

// 🆔 Passport
const passport = require('passport');
const TwitterStrategy = require('passport-twitter').Strategy;
// const GitHubStrategy = require('passport-github2').Strategy;

// ⛩ Handlebars
const hbs = require('express-handlebars');
const dumpObject = require('./helpers/dumpobject');
const hbsHelpers = require('handlebars-helpers')();

// 🏃‍♀️💨 Express
const express = require('express');
const helmet = require('helmet');
const renderUsers = require('./middleware/render-users');
const renderDebug = require('./middleware/render-debug');
const handleError = require('./middleware/handle-errors')
const handle404 = require('./middleware/handle-404')
const controllers = require('./controllers')
const routesLogin = require('./routes/login')
const users = require('./models/user');
const ErrorHandler = require('./utilities/error-handler');
const app = express();


// ⛑ Configure Helmet headers
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'"],
      styleSrc: ["'self'", "https://fonts.googleapis.com"],
      fontSrc: ["'self'", "https://fonts.gstatic.com"]
    }
  }
}));

// Templates
app.set('view engine', '.hbs')
app.engine('.hbs', hbs({
  helpers: { ...hbsHelpers, dumpObject },
  extname: '.hbs',
  defaultLayout: 'default'
}))
app.set('view cache', process.env['DEBUG'] ? false : true);

// AUTHENTICATION
// -----------------------
app.use(require('express-session')({ secret: '76tttrs3%tskn£%knjhbhcfdxsewaer4trytuiuhk$', resave: true, saveUninitialized: true }));
// Build an oauth callback URL from environment variables.
// This is stupidly complex
const constructOauthCallbackUrl = function (strategy) {
  let result = `${config.siteProtocol}${config.siteDomain}${(config.sitePortExternal && config.sitePortExternal != 80 ? ':' + config.sitePortExternal : '')}/login/${strategy}/callback`;
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
passport.use(new TwitterStrategy(passportTwitterOptions, function (token, tokenSecret, profile, cb) {
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
passport.serializeUser(function (userAppObj, callback) {
  // serialize into session token - only need to store user ID in here
  callback(null, userAppObj.id);
});

passport.deserializeUser(function (userAppId, callback) {
  // deserialize out of session token and into a full user object
  callback(null, users.getAppUserObjFromAppId(userAppId));
});


app.use(passport.initialize()) // Initialize Passport in Express.
app.use(passport.session()) // Restore Passport's authentication state, if any, from the session.
app.use(renderUsers) // Make user info available to every render
app.use(renderDebug) // Make debug status available to every render
// app.use(renderNodeTypes);

// LOGGING
// ------
// app.use(logger('dev'));

//
// ROUTES
// ------
app.use('/youdidntsaythemagicword', (req, res, next) => res.render('youdidntsaythemagicword', {}))
app.use('/public', express.static(path.join(config.appRoot, 'public'), { fallthrough: false }))
app.use('/login', routesLogin)
app.use('/', [controllers])






// 
// ERROR PAGES
// -----------
app.use((err, req, res, next) => handleError(err, req, res, next)) // Handle any custom errors
app.use((req, res, next) => handle404(req, res, next)) // Handle anything else as a 404



// Boot app
app.listen(config.sitePort, function () {
  debug(`App booted and running at ${config.siteProtocol}${config.siteDomain}:${config.sitePort}`)
  debug('Twitter callback url:', constructOauthCallbackUrl('twitter'))

  //
  // WARM CACHES
  // ------
  cacheTools.warmAll(models)
})
