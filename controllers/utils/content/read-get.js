const debug = require('debug')('sonniesedge:controllers:base:markdown');
const asyncHandler = require('express-async-handler');
const ErrorHandler = require('../../../utilities/error-handler')
const md = require('../../../utilities/markdown-it')

const bodyParser = require('body-parser')
const urlencodedParser = bodyParser.urlencoded({ extended: true })
const is = require('is_js');


// READ
const readGet = (model, options) => {

  options || (options = {});
  return asyncHandler(async (req, res, next) => {
    if (!req.params.id && !options.id) { options.id = 'root' }
    try {
      let itemObj = await model.read(options.id || req.params.id)

      res.render(options.template || 'page', {
        content: md.render(itemObj.content),
        meta: itemObj.data,
        children: options.children ? await options.children() : null,
        id: itemObj.id
      });
    } catch (error) {
      debug('Could not read file')
      throw new ErrorHandler('404', error)
    }
  })
}

module.exports = readGet
