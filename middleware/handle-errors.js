const debug = require('debug')('sonniesedge:middleware:handleErrors')

const errors = (err, req, res, next) => {
  const { statusCode, message, rawError } = err;
  res.status(statusCode || 500);
  res.render('error', {
    status: 'error',
    statusCode: statusCode || 500,
    message: message || null,
    rawError: rawError || null
  })
}

module.exports = errors
