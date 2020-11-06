const debug = require('debug')('sonniesedge:middleware:handleErrors')
const md = require('../utilities/markdown-it')

const errors = (err, req, res, next) => {
  const { statusCode, message, rawError } = err;
  res.status(statusCode || 500);
  res.render('error', {
    status: 'error',
    statusCode: statusCode || 500,
    message: md.render(message) || null,
    rawError: rawError || null
  })
}

module.exports = errors
