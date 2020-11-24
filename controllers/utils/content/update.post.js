const debug = require('debug')('sonniesedge:controllers:base:markdown');
const asyncHandler = require('express-async-handler');
const ErrorHandler = require('../../../utilities/error-handler')
const md = require('../../../utilities/markdown-it')

const bodyParser = require('body-parser')
const urlencodedParser = bodyParser.urlencoded({ extended: true })
const is = require('is_js');


const updatePost = (model, options) => {
  options || (options = {});
  return asyncHandler(async (req, res, next) => {

    // Errors?
    const errors = validationResult(req);

    try {

      if (errors && is.not.empty(errors)) {
        throw new Error('Validation errors present');
      }

      // add any missing data
      // ensureDefaultData() ??
      if (is.falsy(req.body.data.created))
        req.body.data.created = _global.fields.created.default
      if (is.falsy(req.body.data.updated))
        req.body.data.updated = _global.fields.updated.default
      if (is.falsy(req.body.data.uuid))
        req.body.data.uuid = _global.fields.uuid.default
      if (is.falsy(req.body.data.id))
        req.body.data.id = id || _global.fields.id.default

      // save
      note.create(data, content, id)

      // Render
      res.render(options.template || 'create-content/note', {
        success: true,
        flash: { type: 'success', message: `Note updated` },
        content: `Your Note has been updated!`,
        url: `/notes/${req.body.data.id}/`
      });
    } catch (error) {
      res.render(options.template || 'create-content/note', {
        content: `Something went wrong and the note wasn't updated. 😭`,
        errors: errors.toArray()
      });
    }
  })
}

module.exports = updatePost
