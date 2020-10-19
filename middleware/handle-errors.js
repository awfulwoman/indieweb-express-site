const errors = (err, req, res, next) => {
  const { statusCode, message } = err;
  res.status(statusCode);
  res.render('error', {
    status: 'error',
    statusCode: statusCode || 500,
    message: message || null
  })
}

module.exports = errors
