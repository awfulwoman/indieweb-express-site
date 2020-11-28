const debug = require('debug')('sonniesedge:controllers:utils:content:createPost')
const asyncHandler = require('express-async-handler')
const { validationResult, matchedData } = require('express-validator')
const normalizeFormState = require('../../../utilities/form-normalize-state')
const normalizeFormErrors = require('../../../utilities/form-normalize-errors')
const md = require('../../../utilities/markdown-it')
const is = require('is_js')
const config = require('../../../config')
const { DateTime } = require('luxon')
const ErrorHandler = require('../../../utilities/error-handler')

const createPost = (model, options = {}) => {
  
  let formState = {}
  let formErrors = {}

  return asyncHandler(async (req, res, next) => {
    try {

      formState = normalizeFormState(req)
      formErrors = normalizeFormErrors(req)

      // debug('formState: ', formState)
      // debug('formErrors: ', formErrors)

      if (is.not.empty(formErrors)) {
        res.render(options.template || `content-create/types/${model.modelDir}`, {
          data: { title: `${model.modelDir} creation error` },
          content: md.render('There was an error while creating the item.'),
          fields: model.fields, // TODO: remove?
          state: formState,
          errors: formErrors
        })
      } else {

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

        // Read to set up cache
        await model.read(id).catch((error) => {
          throw error
        })

        debug(`/${model.modelDir}/${id} created!`)

        res.render(options.template || 'content-create/default', {
          data: { title: 'Created!' },
          // content: result
          url: `/${model.modelDir}/${id}`
        })
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
