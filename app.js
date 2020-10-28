require('dotenv').config()
const debug = require('debug')('sonniesedge:app')
const path = require('path')
const chalk = require('chalk')
const config = require('./config')
const models = require('./models')
const modelsWarmAll = require('./models/utils/cache/warm-all')
const controllers = require('./controllers')

// 🆔 Passport
const passport = require('./passport');

// ⛩ Handlebars
const hbs = require('express-handlebars');
const customHelpers= require('./helpers')
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
app.use(require('express-session')({ secret: '76tttrs3%tskn£%knjhbhcfdxsewaer4trytuiuhk$', resave: true, saveUninitialized: true }));
app.use(passport.initialize()) // Initialize Passport in Express.
app.use(passport.session()) // Restore Passport's authentication state, if any, from the session.

app.use(renderUsers) // Make user info available to every render
app.use(renderDebug) // Make debug status available to every render

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


// Boot app
app.listen(config.sitePort(), () => {
  console.log(chalk.blue.bold(`----------------------------------------------------------`))
  console.log(chalk.blue.bold(`| `) + chalk.bold(`BOOTING`))
  console.log(chalk.blue.bold(`|---------------------------------------------------------`))
  // TODO: Check that content and data dirs exist at boot
  console.log(chalk.blue.bold(`| `) + chalk.bold.green(`NODE_ENV: `) + chalk.bold(`${process.env.NODE_ENV}`))
  
  for (const [key, value] of Object.entries(config)) {
    console.log(chalk.blue.bold(`| `) + chalk.bold.green(`${key}: `) +  chalk(`${value()}`))
  }

  console.log(chalk.blue.bold(`| `) + chalk.bold.green(`App URL: `) + chalk.bold(`${config.siteProtocol()}${config.siteDomain()}:${config.sitePort()}`))
  console.log(chalk.blue.bold(`----------------------------------------------------------`))

  // WARM CACHES
  // ------
  modelsWarmAll()
})
