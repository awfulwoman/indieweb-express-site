const debug = require('debug')('indieweb-express-site:controllers:content:updateGet')
const asyncHandler = require('express-async-handler')
const is = require('is_js')

const AppError = require('../../utilities/app-error')
const md = require('../../utilities/markdown-it')
const normalizeFormState = require('../../utilities/form-normalize-state')
const config = require('../../config')

const updateGet = (model, options = {}) => {

  let syndicationSilosPresent
  let syndicationSilosMissing

  return asyncHandler(async (req, res, next) => {
    try {
      // read existing note
      let existingItem = await model.read(req.params.id)

      // debug('Existing item: ', existingItem)

      // Smoosh .content and .data together
      let formState = { ...existingItem, ...existingItem.data }
      delete formState.data

      // Flatten everything into an array compatible with the forms
      formState = normalizeFormState(formState)

      debug('Flattened item: ', formState)
      debug('Syndications: ', existingItem.syndications)

      // if (existingItem.syndications) {
      syndicationSilosPresent = existingItem.syndications ? [...new Set(existingItem.syndications.map(item => item.silo))] : []
      syndicationSilosMissing = config.silos().filter(x => !syndicationSilosPresent.includes(x))

      debug('syndicationSilosPresent: ', syndicationSilosPresent)
      debug('syndicationSilosMissing: ', syndicationSilosMissing)
      // }

      res.render(options.template || `content-create/types/${model.id}`, {
        update: true,
        data: { title: `Editing ${model.modelDir}/${req.params.id}` },
        content: `Start editing your ${model.id}!`,
        markdown: formState.content,
        syndications: existingItem.syndications || null,
        // syndicationSilosPresent: syndicationSilosPresent ? syndicationSilosPresent : null,
        syndicationSilosMissing: syndicationSilosMissing ? syndicationSilosMissing : null,
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
