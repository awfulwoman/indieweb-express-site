const debug = require('debug')('sonniesedge:controllers:utils:content:create-read')
const asyncHandler = require('express-async-handler')
const { validationResult } = require('express-validator')
const md = require('../../../utilities/markdown-it')
const is = require('is_js')

const createPost = (model, options) => {
  options || (options = {});
  return asyncHandler((req, res, next) => {
     debug('req.body: %O', req.body)
    const errors = validationResult(req);
    debug('Errors: ', errors.array())

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
      form_errors[replacedParam]  = error.msg
    }

    if(errors) {
      res.render(`create/notes`, {
        data: { title: `${model.modelDir} creation` },
        content: md.render('Get creating, or something.'),
        fields: model.fields,
        state: form_state,
        errors: form_errors
      }) 
    } else {
      // model.create()
      res.render('page', {
        data: { title: 'Note created!' }
      })
    }
  })
}

module.exports = createPost
