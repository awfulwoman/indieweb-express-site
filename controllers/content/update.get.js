const debug = require('debug')('sonniesedge:controllers:content:updateGet')
const asyncHandler = require('express-async-handler');
const ErrorHandler = require('../../utilities/error-handler')
const md = require('../../utilities/markdown-it')
const normalizeFormState = require('../../utilities/form-normalize-state')

const bodyParser = require('body-parser')
const urlencodedParser = bodyParser.urlencoded({ extended: true })
const is = require('is_js');


// UPDATE

const updateGet = (model, options = {}) => {

  return asyncHandler(async (req, res, next) => {
    try {
      // read existing note
      let existingItem = await model.read(req.params.id)

      // Smoosh .content and .data together
      let formState = { ...existingItem, ...existingItem.data }
      delete formState.data

      formState = normalizeFormState(formState)

      debug('Existing item: ', formState)

      res.render(options.template || `content-create/types/${model.id}`, {
        data: { title: `${model.modelDir} editing` },
        content: `Start editing your ${model.id}!`,
        state: formState
      })
    } catch (error) {
      throw error
    }
  })
}

module.exports = updateGet
