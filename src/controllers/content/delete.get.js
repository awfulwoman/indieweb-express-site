const debug = require('debug')('indieweb-express-site:controllers:content:deleteGet')
const asyncHandler = require('express-async-handler');
const AppError = require('../../utilities/app-error')
const { md } = require('../../utilities')

const bodyParser = require('body-parser')
const urlencodedParser = bodyParser.urlencoded({ extended: true })
const is = require('is_js');

// DELETE

const deleteGet = (model, options) => {
  options || (options = {});
  return asyncHandler(async (req, res, next) => {
    res.render(options.template || 'default', {
      data: { title: 'Under construction' },
      content: 'TODO: Implement'
    })
  })
}

module.exports = deleteGet
