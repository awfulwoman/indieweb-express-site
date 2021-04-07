const debug = require('debug')('indieweb-express-site:middleware:renderErrors')
const { md } = require('../utilities')

const renderErrors = (err, req, res, next) => {
  let { statusCode, message, rawError } = err
  if (message) { message = md.render(message) } else { message = null }

  res.status(statusCode || 500)
  res.render('error', {
    status: 'error',
    statusCode: statusCode || 500,
    contentHtml: message,
    rawError: rawError || 'no rawError'
  })
}

module.exports = renderErrors
