const debug = require('debug')('sonniesedge:controllers:base:markdown');
const asyncHandler = require('express-async-handler');
const ErrorHandler = require('../../../utilities/error-handler')
const md = require('../../../utilities/markdown-it')

const bodyParser = require('body-parser')
const urlencodedParser = bodyParser.urlencoded({ extended: true })
const is = require('is_js');


const updatePost = (model, options) => {
  options || (options = {});
  return asyncHandler((req, res, next) => {

    // Errors?
    const errors = validationResult(req);

    try {

      if (errors && is.not.empty(errors)) {
        throw new Error('Validation errors present');
      }

      // add any missing data
      // ensureDefaultData() ??
      if (is.falsy(req.body.meta.created))
        req.body.meta.created = _global.fields.created.default
      if (is.falsy(req.body.meta.updated))
        req.body.meta.updated = _global.fields.updated.default
      if (is.falsy(req.body.meta.uuid))
        req.body.meta.uuid = _global.fields.uuid.default
      if (is.falsy(req.body.meta.id))
        req.body.meta.id = id || _global.fields.id.default

      // save
      note.create(meta, content, id)

      // Render
      res.render('create/note/', {
        success: true,
        flash: { type: 'success', message: `Note created` },
        content: `Your new Note has been created!`,
        url: `/notes/${req.body.meta.id}/`
      });
    } catch (error) {
      res.render('create/note', {
        flash: { type: 'error', message: `Note creation failed`, additional: error.toString() },
        content: `Something went wrong and the note wasn't created. 😭`,
        errors: errors.toArray()
      });
    }
  })
}

module.exports = updatePost
