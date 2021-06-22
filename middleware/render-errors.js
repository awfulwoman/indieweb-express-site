const debug = require('debug')('indieweb-express-site:middleware:renderErrors')
const { md } = require('../utilities')

const renderErrors = (err, req, res, next) => {
  let { statusCode, message, rawError } = err
  // if (message) { message = md.render(message) } else { message = null }
  debug(message)

  res.status(statusCode || 500)
  res.render('error', {
    status: 'error',
    statusCode: statusCode || 500,
    extended: {
      content: {
        html: md.render(message || 'No error message supplied'),
        markdown: message || 'No error message supplied'
      }
    },
    rawError: rawError || 'No raw error supplied'
  })
}

module.exports = renderErrors
