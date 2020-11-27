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
  return asyncHandler(async (req, res, next) => {

    // read existing note
    let existingItem = await model.read(req.params.id)

    debug('Existing item: ', existingItem)

    let formState = {...existingItem, ...existingItem.data}
    delete formState.data
    

    // place state

    res.render(options.template || 'content-create/types/notes', {
      content: `Start creating your note!`,
      state: formState
    });
  })
}

module.exports = updateGet
