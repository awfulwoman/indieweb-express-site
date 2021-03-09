const debug = require('debug')('indieweb-express-site:controllers:content:updateGet')
const asyncHandler = require('express-async-handler')
const is = require('is_js')

const shared = require('./shared')
const config = require('../../config')

const updateGet = (model, options = {}) => {
  return asyncHandler(async (req, res, next) => {
    try {
      // read existing item
      const existingItem = await model.read(req.params.id)

      // Smoosh .content and .data together
      let formState = { ...existingItem, ...existingItem.data }
      delete formState.data

      // Flatten everything into an array compatible with the forms
      formState = shared.formNormalizeState(formState)

      // return {
      //   update: true,
      //   data: { title: `Editing ${model.modelDir}/${req.params.id}` },
      //   content: `Start editing your ${model.id}!`,
      //   markdown: formState.content,
      //   syndications: existingItem.syndications || null,
      //   syndicationSilosMissing: shared.syndicationSilosMissing(config.silos(), existingItem.syndications),
      //   state: formState,
      //   id: req.params.id,
      //   storage: model.modelDir
      // }

      res.render(options.template || `content-create/types/${model.id}`, {
        update: true,
        data: { title: `Editing ${model.modelDir}/${req.params.id}` },
        content: `Start editing your ${model.id}!`,
        markdown: formState.content,
        syndications: existingItem.syndications || null,
        // syndicationSilosPresent: syndicationSilosPresent ? syndicationSilosPresent : null,
        syndicationSilosMissing: shared.syndicationSilosMissing(config.silos(), existingItem.syndications),
        state: formState,
        id: req.params.id,
        storage: model.modelDir
      })
    } catch (error) {
      debug(error)
      throw error
    }
  })
}

module.exports = updateGet
