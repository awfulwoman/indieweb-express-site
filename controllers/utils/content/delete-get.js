
const debug = require('debug')('sonniesedge:controllers:base:markdown');
const asyncHandler = require('express-async-handler');
const ErrorHandler = require('../../../utilities/error-handler')
const md = require('../../../utilities/markdown-it')

const bodyParser = require('body-parser')
const urlencodedParser = bodyParser.urlencoded({ extended: true })
const is = require('is_js');

// DELETE

const deleteGet = (model, options) => {
  options || (options = {});
  return asyncHandler(async (req, res, next) => {
    res.render('page', {
      data: { title: 'Under construction' },
      content: 'TODO: Implement'
    })
  })
}

module.exports = deleteGet
