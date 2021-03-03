const debug = require('debug')('indieweb-express-site:middleware:renderErrors')
const md = require('../utilities/markdown-it')

const renderErrors = (err, req, res, next) => {
  if (process.env['DEBUG']) debug('ERROR DEBUG:', err)
  let { statusCode, message, rawError } = err
  if (message) {message = md.render(message)} else { message = null }
  // if (statusCode === 404 || statusCode === '404') {
  //   next()
  // } else {
    res.status(statusCode || 500)
    res.render('error', {
      status: 'error',
      statusCode: statusCode || 500,
      contentHtml: message,
      rawError: rawError || null
    })
  // }
}

module.exports = renderErrors
