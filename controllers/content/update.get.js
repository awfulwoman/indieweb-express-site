const debug = require('debug')('indieweb-express-site:controllers:content:updateGet')
const is = require('is_js')

const shared = require('./shared')
const config = require('../../config')

const updateGet = async (args) => {
  const argObj = { ...args }

  // read existing item
  const existingItem = await argObj.model.read(argObj.id)

  // Smoosh .content and .data together
  let formState = { ...existingItem, ...existingItem.data }
  delete formState.data

  // Flatten everything into an array compatible with the forms
  formState = shared.flattenFormBody(formState)

  return {
    data: { title: `Editing ${argObj.model.modelDir}/${argObj.id}` },
    content: `Start editing your ${argObj.model.id}!`,
    syndications: existingItem.syndications || null,
    syndicationSilosMissing: shared.syndicationSilosMissing(config.silos(), existingItem.syndications),
    state: formState,
    id: argObj.id,
    storage: argObj.model.modelDir
  }
}

module.exports = updateGet
