const render404 = (req, res, next) => {
  res.status(404)
  res.render('error', {
    status: 'error',
    statusCode: '404',
    contentHtml: 'Nothing to see here. Go home.'
  })
}

module.exports = render404
