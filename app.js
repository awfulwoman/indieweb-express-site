require('dotenv').config()
const debug = require('debug')('indieweb-express-site:app')
const path = require('path')
const fs = require('fs')
const chalk = require('chalk')
const config = require('./config')
const utilities = require('./utilities')
const users = require('./models/user')

// 📊 Logging
const morgan = require('morgan')
const rfs = require('rotating-file-stream')

// 🆔 Passport
const passport = require('passport')

// ⛩ Handlebars
const hbs = require('express-handlebars')
const hbsHelpers = require('handlebars-helpers')()
const customHelpers = require('./helpers')

// 🏃‍♀️💨 Express app
const express = require('express')
const helmet = require('helmet')
const session = require('express-session')
const FileStore = require('session-file-store')(session)
const staticify = require('staticify')(path.join(__dirname, 'public'))
const middleware = require('./middleware')
const routes = require('./routes')
const controllers = require('./controllers')

try {
  const app = express()

  // Check for login credentials
  if (!config.twitterConsumerKey() || !config.twitterConsumerSecret()) throw new utilities.AppError('500', `Could not find Twitter credentials`)
  if (!config.githubClientId() || !config.githubClientSecret() ) throw new utilities.AppError('500', `Could not find Github credentials`)

  // Check for working directories
  if (!fs.existsSync(config.contentRoot())) throw new utilities.AppError('500', `Could not find ${config.contentRoot()}`)
  if (!fs.existsSync(config.dataRoot())) throw new utilities.AppError('500', `Could not find ${config.dataRoot()}`)
  if (!fs.existsSync(config.logDir())) throw new utilities.AppError('500', `Could not find ${config.logDir()}`)

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
      getVersionedPath: staticify.getVersionedPath
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
    secret: config.keyboardCat(),
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

  // Set options
  const passportTwitterOptions = {
    consumerKey: config.twitterConsumerKey(),
    consumerSecret: config.twitterConsumerSecret(),
    callbackURL: utilities.constructOauthCallback.oaUrl('twitter')
  }

  const passportGithubOptions = {
    clientID: config.githubClientId(),
    clientSecret: config.githubClientSecret(),
    callbackURL: utilities.constructOauthCallback.oaUrl('github')
  }

  // Use Twitter passport strategy
  passport.use(new TwitterStrategy(passportTwitterOptions, function (token, tokenSecret, profile, cb) {
    debug('Someone trying to login with following Twitter profile: ', profile.username)
    let appUserProfile = users.getAppUserObjFromExternalId(profile.id, 'twitter')
    return cb(null, appUserProfile)
  }))

  // Use Github passport strategy
  passport.use(new GitHubStrategy(passportGithubOptions, function (accessToken, refreshToken, profile, cb) {
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
  app.use(middleware.renderUsers) // Make user info available to every render
  app.use(middleware.renderDebug) // Make debug status available to every render
  app.use(middleware.renderBuildTime)
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
  app.use('/webmention', [routes.webmentions.send])
  app.use('/syndication', [routes.syndication.create, routes.syndication.store])
  app.use('/youdidntsaythemagicword', (req, res, next) => res.render('youdidntsaythemagicword', {}))
  app.use(staticify.middleware)
  app.use('/', [routes.offline, routes.disambiguation, routes.archives, routes.auth, routes.content])



  // 
  // ERROR PAGES
  // -----------
  app.use((err, req, res, next) => middleware.renderErrors(err, req, res, next)) // Handle any custom errors
  app.use((req, res, next) => middleware.render404(req, res, next)) // Handle anything else as a 404

  // Boot app
  app.listen(config.sitePort(), () => {
    console.log(chalk.blue.bold(` ---------------------------------------------------------`))
    console.log(chalk.blue.bold(`| `) + chalk.bold(`BOOTING`))
    console.log(chalk.blue.bold(`|---------------------------------------------------------`))
    console.log(chalk.blue.bold(`| `) + chalk.bold.green(`NODE_ENV: `) + chalk(`${process.env.NODE_ENV}`))

    for (const [key, value] of Object.entries(config)) {
      console.log(chalk.blue.bold(`| `) + chalk.bold.green(`${key}: `) + chalk(`${value()}`))
    }

    console.log(chalk.blue.bold(`| `) + chalk.bold.green(`Public app URL: `) + chalk(`${config.siteProtocol()}${config.siteDomain()}:${config.sitePort()}`))
    console.log(chalk.blue.bold(`| `) + chalk.bold.green(`Twitter callback URL: `) + chalk(utilities.constructOauthCallback.oaUrl('twitter')))
    console.log(chalk.blue.bold(`| `) + chalk.bold.green(`Github callback URL: `) + chalk(utilities.constructOauthCallback.oaUrl('github')))
    console.log(chalk.blue.bold(` ---------------------------------------------------------`))

    // WARM CACHES
    // ------
    // models.warmAll()
    controllers.cacheController.warmAllContent()
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
    console.log(`emergencyApp listening at ${chalk(`${config.siteProtocol()}${config.siteDomain()}:${config.sitePort()}`)}`)
  })
}

