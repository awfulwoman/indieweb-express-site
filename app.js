require('dotenv').config()
const debug = require('debug')('sonniesedge:app')
const path = require('path')
const is = require('is_js')
const fs = require('fs')
const chalk = require('chalk')
const config = require('./config')
const models = require('./models')
const modelsWarmAll = require('./models/utils/cache/warm-all')
const controllers = require('./controllers')
const ErrorHandler = require('./utilities/error-handler')

// 📊 Logging
const morgan = require('morgan')
const rfs = require('rotating-file-stream')

// 🆔 Passport
const passport = require('passport')

// ⛩ Handlebars
const hbs = require('express-handlebars')
const customHelpers = require('./helpers')
const hbsHelpers = require('handlebars-helpers')()

// 🏃‍♀️💨 Express
const express = require('express');
const helmet = require('helmet');
const renderUsers = require('./middleware/render-users')
const renderDebug = require('./middleware/render-debug')
const handleErrors = require('./middleware/handle-errors')
const handle404 = require('./middleware/handle-404')

const routesLogin = require('./routes/login')
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
app.engine('hbs', hbs({
  helpers: { ...hbsHelpers, ...customHelpers },
  extname: '.hbs',
  defaultLayout: 'default'
}))

// AUTHENTICATION + SESSIONS
// -----------------------
app.use(require('express-session')({ secret: process.env['KEYBOARD_CAT'], resave: true, saveUninitialized: true }))





const TwitterStrategy = require('passport-twitter').Strategy
// const GitHubStrategy = require('passport-github2').Strategy;


const constructOauthCallbackUrl = function (strategy) {
  let result = `${config.siteProtocol()}${config.siteDomain()}${(config.sitePortExternal() && config.sitePortExternal() != 80 ? ':' + config.sitePortExternal() : '')}/login/${strategy}/callback`;
  return result;
}

if (!process.env['TWITTER_CONSUMER_KEY'] || !process.env['TWITTER_CONSUMER_SECRET']) return

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
var accessLogStream = rfs.createStream('access.log', {
  interval: '1d', // rotate daily
  path: config.logDir()
})
app.use(morgan('combined', { stream: accessLogStream }))

// LOGGING
// ------
// app.use(logger('dev'));

//
// ROUTES
// ------
app.use('/youdidntsaythemagicword', (req, res, next) => res.render('youdidntsaythemagicword', {}))
app.use(express.static('public'))
app.use('/login', routesLogin)
app.use('/', [controllers])


// 
// ERROR PAGES
// -----------
app.use((err, req, res, next) => handleErrors(err, req, res, next)) // Handle any custom errors
app.use((req, res, next) => handle404(req, res, next)) // Handle anything else as a 404

try {
  // Check to make sure working dirs exist
  if (!fs.existsSync(config.contentRoot())) throw new ErrorHandler('500', `Could not find ${config.contentRoot()}`)
  if (!fs.existsSync(config.dataRoot())) throw new ErrorHandler('500', `Could not find ${config.dataRoot()}`)
  if (!fs.existsSync(config.logDir())) throw new ErrorHandler('500', `Could not find ${config.logDir()}`)

  // Boot app
  app.listen(config.sitePort(), () => {
    console.log(chalk.blue.bold(`----------------------------------------------------------`))
    console.log(chalk.blue.bold(`| `) + chalk.bold(`BOOTING`))
    console.log(chalk.blue.bold(`|---------------------------------------------------------`))
    console.log(chalk.blue.bold(`| `) + chalk.bold.green(`NODE_ENV: `) + chalk.bold(`${process.env.NODE_ENV}`))

    for (const [key, value] of Object.entries(config)) {
      console.log(chalk.blue.bold(`| `) + chalk.bold.green(`${key}: `) + chalk(`${value()}`))
    }

    console.log(chalk.blue.bold(`| `) + chalk.bold.green(`App URL: `) + chalk.bold(`${config.siteProtocol()}${config.siteDomain()}:${config.sitePort()}`))
    console.log(chalk.blue.bold(`----------------------------------------------------------`))

    debug(constructOauthCallbackUrl('twitter'))

    // WARM CACHES
    // ------
    modelsWarmAll()
  })

} catch (error) {
  console.log(chalk.bold.red(`ERROR: `), error)

  const emergencyApp = express();
  emergencyApp.get('/', (req, res) => {
    res.statusCode = 500;
    res.setHeader('Content-Type', 'text/plain');
    res.json(error)
  })

  emergencyApp.listen(config.sitePort(), () => {
    console.log(`emergencyApp listening at http://localhost:${config.sitePort()}`)
  })
}

