const debug = require('debug')('sonniesedge:controllers:content:createPost')
const asyncHandler = require('express-async-handler')
const { validationResult, matchedData } = require('express-validator')
const normalizeFormState = require('../../utilities/form-normalize-state')
const normalizeFormErrors = require('../../utilities/form-normalize-errors')
const md = require('../../utilities/markdown-it')
const is = require('is_js')
const config = require('../../config')
const { DateTime } = require('luxon')
const ErrorHandler = require('../../utilities/error-handler')
const files = require('../../drivers/files')

const createPost = (model, options = {}) => {

  let formState = {}
  let formErrors = {}

  return asyncHandler(async (req, res, next) => {
    try {

      debug('FILES:')
      debug(req.files)

      formState = normalizeFormState(req)
      formErrors = normalizeFormErrors(req)

      if (is.not.empty(formErrors)) {
        res.render(options.template || `content-create/types/${model.id}`, {
          data: { title: `${model.modelDir} creation error` },
          content: md.render('There was an error while creating the item.'),
          fields: model.fields, // TODO: remove?
          state: formState,
          errors: formErrors
        })
      } else {

        debug('formstate: ', formState)
        debug('matchedData: ', matchedData(req))

        let data = matchedData(req)
        let content = matchedData(req).content ? matchedData(req).content : ' '
        delete data.content

        let tempCurrentDate = DateTime.local().toUTC()

        if (!data.created) data.created = tempCurrentDate.toISO()
        if (!data.modified) data.modified = tempCurrentDate.toISO()

        // Create an item ID from the current date
        let id = DateTime.fromISO(data.created).toUTC().toFormat(config.fileDateFormat())

        await model.create(data, content, id).catch((error) => {
          throw error
        })

        // Get list of all files to save


        for (const file of req.files) {
          await files.create(model.modelDir, id, file.originalname, file.buffer)
        }

        // Move uploaded files to dir
        // await files.create(model.modelDir, id, req.file)

        // Read to set up cache
        await model.read(id).catch((error) => {
          throw error
        })

        debug(`/${model.modelDir}/${id} created!`)

        res.redirect(`/${model.modelDir}/${id}`)
      }
    } catch (error) {
      throw new ErrorHandler(
      '409', 
      '"The request could not be completed due to a conflict with the current state of the resource (i.e. it already exists)". \n\n Could not create this item. \n\n Better luck next time old bean.', 
      error
      )
    }

  })
}

module.exports = createPost
