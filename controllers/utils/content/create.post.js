const debug = require('debug')('sonniesedge:controllers:utils:content:createPost')
const asyncHandler = require('express-async-handler')
const { validationResult } = require('express-validator')
const md = require('../../../utilities/markdown-it')
const is = require('is_js')
const config = require('../../../config')
const { DateTime } = require('luxon')
const ErrorHandler = require('../../../utilities/error-handler')

const createPost = (model, options) => {
  options || (options = {});
  return asyncHandler(async (req, res, next) => {
    try {

      const errors = validationResult(req);
      let form_state = {}
      let form_errors = {}

      for (const key in req.body) {
        if (req.body.hasOwnProperty(key)) {        // debug(key, req.body[key])
          if (is.object(req.body[key])) {
            for (const keyChild in req.body[key]) {
              form_state[`${key}_${keyChild}`] = req.body[key][keyChild]
            }
          } else {
            form_state[key] = req.body[key]
          }
        }
      }

      for (const error of errors.array()) {
        let replacedParam = error.param.replace('.', '_')
        form_errors[replacedParam] = error.msg
      }

      if (errors.array().length > 0) {
        res.render(options.template || `content-create/default`, {
          data: { title: `${model.modelDir} creation` },
          content: md.render('Get creating, or something.'),
          fields: model.fields,
          state: form_state,
          errors: form_errors
        })
      } else {

        let data = req.body
        let content = req.body.content
        delete data.content

        let id = DateTime.local().toFormat(config.fileDateFormat())

        await model.create(data, content, id).catch((error) => {
          throw error
        })

        // Read to set up cache
        await model.read(id)

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
      '"The request could not be completed due to a conflict with the current state of the resource". \n\n Could not create this item. \n\n Better luck next time old bean.', 
      error
      )
    }

  })
}

module.exports = createPost
