const errors = (err, res) => {
  const { statusCode, message } = err;
  res.status(statusCode);
    res.render('error', {
      status: 'error',
      statusCode: statusCode,
      message: message || null
    });
};

module.exports = errors
