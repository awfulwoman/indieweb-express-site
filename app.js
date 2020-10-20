require('dotenv').config()
const debug = require('debug')('sonniesedge:app');
const path = require('path')
const config = require('./config')
const models = require('./models')
const controllers = require('./controllers')

// 🆔 Passport
const passport = require('./passport');

// ⛩ Handlebars
const hbs = require('express-handlebars');
const dumpObject = require('./helpers/dumpobject')
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
app.engine('.hbs', hbs({
  helpers: { ...hbsHelpers, dumpObject },
  extname: '.hbs',
  defaultLayout: 'default'
}))
app.set('view cache', process.env['DEBUG'] ? false : true);

// AUTHENTICATION + SESSIONS
// -----------------------
app.use(require('express-session')({ secret: '76tttrs3%tskn£%knjhbhcfdxsewaer4trytuiuhk$', resave: true, saveUninitialized: true }));
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
app.use((err, req, res, next) => handleErrors(err, req, res, next)) // Handle any custom errors
app.use((req, res, next) => handle404(req, res, next)) // Handle anything else as a 404


// Boot app
app.listen(config.sitePort, () => {
  debug(`-----------------------------------------------------`)
  debug(`BOOTING`)
  debug(`-----------------------------------------------------`)
  debug(`App booted and running at ${config.siteProtocol}${config.siteDomain}:${config.sitePort}`)
  debug(config)
  debug(`-----------------------------------------------------`)

  // WARM CACHES
  // ------
  models.warmAll()
})
