const debug = require('debug')('sonniesedge:controllers:base:markdown');
const asyncHandler = require('express-async-handler');
const ErrorHandler = require('../../../utilities/error-handler')
const md = require('../../../utilities/markdown-it')

const bodyParser = require('body-parser')
const urlencodedParser = bodyParser.urlencoded({ extended: true })
const is = require('is_js');


// UPDATE

const updateGet = (model, options) => {
  options || (options = {});
  return asyncHandler((req, res, next) => {
    res.render(options.template || 'create-content/note', {
      content: `Start creating your note!`,
      fields: model.fields
    });
  })
}

module.exports = updateGet
