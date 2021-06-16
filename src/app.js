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
const flash = require('connect-flash')

const staticify = require('staticify')(path.join(__dirname, 'public'))
const middleware = require('./middleware')
const routes = require('./routes')
const controllers = require('./controllers')

try {
  const app = express()

  // Check for login credentials
  if (!config.twitterConsumerKey() || !config.twitterConsumerSecret()) throw new utilities.AppError('500', 'Could not find Twitter credentials')
  if (!config.githubClientId() || !config.githubClientSecret()) throw new utilities.AppError('500', 'Could not find Github credentials')

  // Check for working directories
  if (!fs.existsSync(config.contentRoot())) throw new utilities.AppError('500', `Could not find ${config.contentRoot()}`)
  if (!fs.existsSync(config.dataRoot())) throw new utilities.AppError('500', `Could not find ${config.dataRoot()}`)
  if (!fs.existsSync(config.logDir())) throw new utilities.AppError('500', `Could not find ${config.logDir()}`)

  // ⛑ Configure CSP headers
  // Use defaults from Helmet, and customize CSP
  app.use(helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'", "whalecoiner.net", "whalecoiner.org", "sonniesedge.net", "www.sonniesedge.net", "sonniesedge.co.uk", "www.sonniesedge.co.uk"],
        imgSrc: ["'self'", "data:", "platform.twitter.com", "syndication.twitter.com"],
        scriptSrc: ["'self'", "platform.twitter.com", "syndication.twitter.com"],
        styleSrc: ["'self'", "https:", "'unsafe-inline'", "platform.twitter.com", "syndication.twitter.com"],
        childSrc: ["'self'", "platform.twitter.com", "syndication.twitter.com"],
        fontSrc: ["'self'", "https:", "data:"],
        connectSrc: ["'self'"],
        objectSrc: ["'self'"]
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
    const appUserProfile = users.getAppUserObjFromExternalId(profile.id, 'twitter')
    return cb(null, appUserProfile)
  }))

  // Use Github passport strategy
  passport.use(new GitHubStrategy(passportGithubOptions, function (accessToken, refreshToken, profile, cb) {
    debug('Someone trying to login with following Github profile: ', profile.username)
    const appUserProfile = users.getAppUserObjFromExternalId(profile.id, 'github')
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

  app.use(middleware.session)
  app.use(passport.initialize()) // Initialize Passport in Express.
  app.use(passport.session()) // Restore Passport's authentication state, if any, from the session.
  app.use(flash()) // Allow messages to be passed to redirects
  app.use(middleware.renderNav)
  app.use(middleware.isAdmin) // Determine if the user is an admin
  app.use(middleware.renderUsers) // Make user info available to every render
  app.use(middleware.renderDebug) // Make debug status available to every render
  app.use(middleware.renderBuildTime) // Add (static) buildtime to every render
  app.use(function (req, res, next) {
    // if there's a flash message in the session request, make it available in the response, then delete it
    res.locals.messages = req.session.flash
    delete req.session.flash
    next()
  })
  app.use(middleware.clacksOverhead) // You helped me survive a horrible childhood, Terry. <3
  //
  // HTTP LOGGING
  // ------------

  const accessLogStream = rfs.createStream('access.log', {
    interval: '1d', // rotate daily
    path: path.join(config.logDir(), 'http')
  })

  // log only 4xx and 5xx responses to console
  app.use(morgan('dev', {
    skip: function (req, res) { return res.statusCode < 400 }
  }))

  app.use(morgan('combined', { stream: accessLogStream }))

  //
  // APP LOGGING
  // ------
  // See config.winston.js

  //
  // ROUTES
  // ------
  app.use('/webmention', [routes.webmentions.send])
  app.use('/syndication', [routes.syndication.create, routes.syndication.store])
  app.use('/youdidntsaythemagicword', (req, res, next) => res.render('youdidntsaythemagicword', {}))
  app.use(staticify.middleware)
  app.use('/', [routes.offline, routes.feeds, routes.disambiguation, routes.archives, routes.auth, routes.content])

  //
  // ERROR PAGES
  // -----------
  app.use((err, req, res, next) => middleware.renderErrors(err, req, res, next)) // Handle any custom errors
  app.use((req, res, next) => middleware.render404(req, res, next)) // Handle anything else as a 404

  // Boot app
  app.listen(config.sitePort(), () => {
    console.log(chalk.blue.bold(' ---------------------------------------------------------'))
    console.log(chalk.blue.bold('| ') + chalk.bold('BOOTING'))
    console.log(chalk.blue.bold('|---------------------------------------------------------'))
    console.log(chalk.blue.bold('| ') + chalk.bold.green('NODE_ENV: ') + chalk(`${process.env.NODE_ENV}`))

    for (const [key, value] of Object.entries(config)) {
      console.log(chalk.blue.bold('| ') + chalk.bold.green(`${key}: `) + chalk(`${value()}`))
    }

    console.log(chalk.blue.bold('| ') + chalk.bold.green('Public app URL: ') + chalk(`${config.siteProtocol()}${config.siteDomain()}:${config.sitePort()}`))
    console.log(chalk.blue.bold('| ') + chalk.bold.green('Twitter callback URL: ') + chalk(utilities.constructOauthCallback.oaUrl('twitter')))
    console.log(chalk.blue.bold('| ') + chalk.bold.green('Github callback URL: ') + chalk(utilities.constructOauthCallback.oaUrl('github')))
    console.log(chalk.blue.bold(' ---------------------------------------------------------'))

    // WARM CACHES
    // ------
    // models.warmAll()
    controllers.cacheController.warmAllContent()
  })
} catch (error) {
  console.log(chalk.bold.red('ERROR: '), error)

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
