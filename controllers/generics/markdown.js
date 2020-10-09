const debug = require('debug')('sonniesedge:controllers:generics:markdown');
const asyncHandler = require('express-async-handler');
const ErrorHandler = require('../../utilities/error-handler')

const bodyParser = require('body-parser')
const urlencodedParser = bodyParser.urlencoded({ extended: true })
const is = require('is_js');

// CREATE
exports.create = {
  get: (model, options) => {
    options || (options = {});
    return asyncHandler((req, res, next) => {

    })
  },

  post: (model, options) => {
    options || (options = {});
    return asyncHandler((req, res, next) => {

    })
  }
}

// READ
exports.read = function (model, options) {

  options || (options = {});
  return asyncHandler(async (req, res, next) => {
    debug('read options: ', options)
    try {
      let itemObj = await model.read(options.id || req.params.id);

      res.render(options.template || 'page', {
        content: itemObj.content,
        meta: itemObj.data,
        children: options.children ? options.children.latest : null
      });
    } catch (error) {
      throw new ErrorHandler(404, 'Note not found')
    }
  })
}

// UPDATE
exports.update = {
  get: (model, options) => {
    options || (options = {});
    return asyncHandler((req, res, next) => {
      res.render('create/note', {
        content: `Start creating your note!`,
        fields: note.fields
      });
    })
  },

  post: (model, options) => {
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
}

// DELETE
exports.delete = {
  get: (model, options) => {
    options || (options = {});
    return asyncHandler(async (req, res, next) => {

    })
  },

  post: (model, options) => {
    options || (options = {});
    return asyncHandler(async (req, res, next) => {

    })
  }
}



