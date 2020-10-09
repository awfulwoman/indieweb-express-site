
const debug = require('debug')('sonniesedge:controllers:note');
const asyncHandler = require('express-async-handler');
const ErrorHandler = require('../../utilities/error-handler')

const readMarkdown = function(model, options) {
  options || (options = {});
  return asyncHandler(async (req, res, next) => {
    try {
      let itemObj = await model.read(req.params.id);
  
      res.render('page', {
        content: itemObj.content,
        meta: itemObj.data,
      });
    } catch (error) {
      throw new ErrorHandler(404, 'Note not found')
    }
  })
}

module.exports = readMarkdown
