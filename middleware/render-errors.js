const debug = require('debug')('indieweb-express-site:middleware:renderErrors')
const md = require('../utilities/markdown-it')

const renderErrors = (err, req, res, next) => {
  if (process.env['DEBUG']) debug(err)
  const { statusCode, message, rawError } = err;
  res.status(statusCode || 500);
  res.render('error', {
    status: 'error',
    statusCode: statusCode || 500,
    message: md.render(message) || null,
    rawError: rawError || null
  })
}

module.exports = renderErrors
