const debug = require('debug')('sonniesedge:controllers:utils:content:updatePost')
const asyncHandler = require('express-async-handler')
const { validationResult, matchedData } = require('express-validator')
const normalizeFormState = require('../../../utilities/form-normalize-state')
const normalizeFormErrors = require('../../../utilities/form-normalize-errors')
const md = require('../../../utilities/markdown-it')
const is = require('is_js')
const config = require('../../../config')
const { DateTime } = require('luxon')
const ErrorHandler = require('../../../utilities/error-handler')

const updatePost = (model, options = {}) => {

  let formState = {}
  let formErrors = {}

  return asyncHandler(async (req, res, next) => {
    try {
      if (!req.params.id) throw new Error('All parameters must be supplied!')

      let id = req.params.id

      formState = normalizeFormState(req)
      formErrors = normalizeFormErrors(req)

      debug('formState: ', formState)
      debug('formErrors: ', formErrors)

      if (is.not.empty(formErrors)) {
        res.render(options.template || `content-create/types/${model.id}`, {
          data: { title: `${model.modelDir} update error` },
          content: md.render('There were errors while updating the item.'),
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

        // debug('Data to update with: ', data)
        // debug('Content to update with: ', content)

        await model.update(data, content, id).catch((error) => {
          throw error
        })

        debug(`/${model.modelDir}/${id} updated!`)

        res.render(options.template || 'content-create/default', {
          data: { title: 'Edited item!' },
          // content: result
          url: `/${model.modelDir}/${id}`
        })
      }
    } catch (error) {
      throw new ErrorHandler(
        '500', 
        'Something went wrong amigo', 
        error
        )
    }
  })
}

module.exports = updatePost
