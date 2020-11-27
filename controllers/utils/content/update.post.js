const debug = require('debug')('sonniesedge:controllers:base:markdown')
const asyncHandler = require('express-async-handler')
const ErrorHandler = require('../../../utilities/error-handler')
const normalizeFormState = require('../../../utilities/form-normalize-state')
const normalizeFormErrors = require('../../../utilities/form-normalize-errors')
const md = require('../../../utilities/markdown-it')
const { validationResult, matchedData } = require('express-validator')

const bodyParser = require('body-parser')
const urlencodedParser = bodyParser.urlencoded({ extended: true })
const is = require('is_js')


const updatePost = (model, options) => {
  options || (options = {})

  debug('Update via POST')

  return asyncHandler(async (req, res, next) => {

    let formState = {}
    let formErrors = {}

    formState = normalizeFormState(req)
    formErrors = normalizeFormErrors(req)

    try {


      debug('formState: ', formState)
      debug('formErrors: ', formErrors)

      // add any missing data
      // ensureDefaultData() ??
      if (is.falsy(req.body.data.created))
        req.body.data.created = _global.fields.created.default
      // if (is.falsy(req.body.data.updated))
        req.body.data.updated = _global.fields.updated.default 
      if (is.falsy(req.body.data.uuid))
        req.body.data.uuid = _global.fields.uuid.default
      if (is.falsy(req.body.data.id))
        req.body.data.id = id || _global.fields.id.default

      // save
      // note.create(data, content, id)

      // Render
      res.render(options.template || 'content-create/types/notes', {
        success: true,
        state: formState,
        content: `Your Note has been updated!`,
        url: `/notes/${req.body.data.id}/`
      });
    } catch (error) {
      res.render(options.template || 'content-create/types/notes', {
        content: `Something went wrong and the note wasn't updated. 😭`,
        errors: formErrors,
        state: formState
      });
    }
  })
}

module.exports = updatePost
