const session = require('express-session')
const FileStore = require('session-file-store')(session)
const config = require('../config')

// AUTHENTICATION + SESSIONS
// -----------------------

const maxAge = 2 * 24 * 60 * 60 * 1000 // two days in milliseconds

const sessionMiddleware = session({
  secret: config.keyboardCat(),
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: maxAge
  },
  store: new FileStore({
    path: config.dataRoot() + '/sessions',
    ttl: maxAge,
    secret: config.keyboardCat()
  })
})

module.exports = sessionMiddleware
