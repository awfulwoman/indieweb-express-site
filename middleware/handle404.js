const handle404 = (res) => {
  res.status(404)
  res.render('error', {
    status: 'error',
    statusCode: '404',
    message: 'Nothing to see here. Go home.'
  })
}

module.exports = handle404
