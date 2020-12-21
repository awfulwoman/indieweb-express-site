require('dotenv').config()
const debug = require('debug')('sonniesedge:app')
const path = require('path')
const fs = require('fs')
const chalk = require('chalk')
const config = require('./config')
const models = require('./models')
const modelsWarmAll = require('./models/utils/cache/warm-all')
const ErrorHandler = require('./utilities/error-handler')
const users = require('./models/user')

// 📊 Logging
const morgan = require('morgan')
const rfs = require('rotating-file-stream')

// 🆔 Passport
const passport = require('passport')

// ⛩ Handlebars
const hbs = require('express-handlebars')
const customHelpers = require('./helpers')
const hbsHelpers = require('handlebars-helpers')()
const repeat = require('handlebars-helper-repeat')

// 🏃‍♀️💨 Express
const express = require('express');
const helmet = require('helmet');
const renderUsers = require('./middleware/render-users')
const renderDebug = require('./middleware/render-debug')
const handleErrors = require('./middleware/handle-errors')
const handle404 = require('./middleware/handle-404')
const renderBuildTime = require('./middleware/render-buildtime')
const constructOauth = require('./utilities/construct-oauth-callback')
const rateLimit = require('express-rate-limit')
const session = require('express-session')
const FileStore = require('session-file-store')(session)
const staticify = require('staticify')(path.join(__dirname, 'public'))
const controllers = require('./routes/content')
const archives = require('./routes/archives')
const disambiguation = require('./routes/disambiguation')
const offline = require('./routes/offline')
const {send} = require('./routes/webmentions')

const authentication = require('./routes/auth')
const app = express()

// ⛑ Configure CSP headers
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'", "blob:", "blob"],
      scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'"],
      styleSrc: ["'self'"],
      fontSrc: ["'self'"],
      connectSrc: ["'self'"]
    }
  }
}))

// Templates
app.set('view engine', '.hbs')
app.engine('hbs', hbs({
  helpers: { 
    ...hbsHelpers, 
    ...customHelpers, 
    getVersionedPath: staticify.getVersionedPath,
    repeat
  },
  extname: '.hbs',
  defaultLayout: 'default',
  compilerOptions: {
    preventIndent: true
  }
}))

// AUTHENTICATION + SESSIONS
// -----------------------
app.use(session({ 
  secret: process.env['KEYBOARD_CAT'] || 'keyboardcatgetoffyoubastard', 
  resave: true, 
  saveUninitialized: true,
  cookie: {
    maxAge: 60000000
  },
  // store: new FileStore({
  //   path: config.dataRoot() + '/sessions'
  // })
}))

const TwitterStrategy = require('passport-twitter').Strategy
const GitHubStrategy = require('passport-github2').Strategy


if (!process.env['TWITTER_CONSUMER_KEY'] || !process.env['TWITTER_CONSUMER_SECRET']) return
if (!process.env['GH_CLIENT_ID'] || !process.env['GH_CLIENT_SECRET']) return

// Set options
const passportTwitterOptions = {
  consumerKey: process.env['TWITTER_CONSUMER_KEY'],
  consumerSecret: process.env['TWITTER_CONSUMER_SECRET'],
  callbackURL: constructOauth.oaUrl('twitter')
}

const passportGithubOptions = {
  clientID: process.env['GH_CLIENT_ID'],
  clientSecret: process.env['GH_CLIENT_SECRET'],
  callbackURL: constructOauth.oaUrl('github')
}

// Use Twitter passport strategy
passport.use(new TwitterStrategy(passportTwitterOptions, function (token, tokenSecret, profile, cb) {
  debug('Someone trying to login with following Twitter profile: ', profile.username)
  let appUserProfile = users.getAppUserObjFromExternalId(profile.id, 'twitter')
  return cb(null, appUserProfile)
}))

// Use Github passport strategy
passport.use(new GitHubStrategy(passportGithubOptions, function(accessToken, refreshToken, profile, cb) {
  debug('Someone trying to login with following Github profile: ', profile.username)
  let appUserProfile = users.getAppUserObjFromExternalId(profile.id, 'github')
  return cb(null, appUserProfile)
}))

// Configure Passport authenticated session persistence.
passport.serializeUser(function (userAppObj, callback) {
  // serialize into session token - only need to store user ID in here
  callback(null, userAppObj.id)
})

passport.deserializeUser(function (userAppId, callback) {
  // deserialize out of session token and into a full user object
  callback(null, users.getAppUserObjFromAppId(userAppId))
})


app.use(passport.initialize()) // Initialize Passport in Express.
app.use(passport.session()) // Restore Passport's authentication state, if any, from the session.
app.use(renderUsers) // Make user info available to every render
app.use(renderDebug) // Make debug status available to every render
app.use(renderBuildTime)
var accessLogStream = rfs.createStream('access.log', {
  interval: '1d', // rotate daily
  path: config.logDir()
})

// log only 4xx and 5xx responses to console
app.use(morgan('dev', {
  skip: function (req, res) { return res.statusCode < 400 }
}))

app.use(morgan('combined', { stream: accessLogStream }))

// LOGGING
// ------
// app.use(logger('dev'));

//
// ROUTES
// ------
app.use('/webmention', [send])
app.use('/youdidntsaythemagicword', (req, res, next) => res.render('youdidntsaythemagicword', {}))
app.use(staticify.middleware)
app.use('/', [offline, disambiguation, archives, authentication, controllers])



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

    debug(constructOauth.oaUrl('twitter'))

    // WARM CACHES
    // ------
    modelsWarmAll()
  })

} catch (error) {
  console.log(chalk.bold.red(`ERROR: `), error)

  const emergencyApp = express()
  emergencyApp.get('/', (req, res) => {
    res.statusCode = 500
    res.setHeader('Content-Type', 'text/plain')
    res.json(error)
  })

  emergencyApp.listen(config.sitePort(), () => {
    console.log(`emergencyApp listening at http://localhost:${config.sitePort()}`)
  })
}

