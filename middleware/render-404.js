const render404 = (req, res, next) => {
  res.status(404)
  res.render('error', {
    status: 'error',
    statusCode: '404',
    content: {
      markdown: 'Nothing to see here. Go home.',
      html: '<p>Nothing to see here. Go home.</p>'
    } 
  })
}

module.exports = render404
