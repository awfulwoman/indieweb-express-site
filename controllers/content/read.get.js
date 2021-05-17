const debug = require('debug')('indieweb-express-site:controllers:content:readGet')
const is = require('is_js')
const path = require('path')
const shared = require('./shared')
const config = require('../../config')

// READ
const readGet = async (model, options = {}) => {
  if (!options.id) { options.id = 'root' }
  if (path.extname(options.id)) throw new Error(`File ${model.modelDir}/${options.id} not found`)
  if (model.resolveAlias) options.id = await model.resolveAlias(options.id)

  const itemObj = await model.read(options.id)
  if (is.falsy(itemObj)) throw new Error(`Could not find ${options.id} in ${model.modelDir}.`)
  if (itemObj.data.private) throw new Error(`${model.modelDir}/${options.id} is private.`)

  itemObj.children = options.children ? await options.children() : null
  itemObj.opengraph = await shared.formatOpengraph(itemObj)

  // Add site config info
  itemObj.site = {
    url: config.sitePort() !== '80' ? config.siteUrl() + ':' + config.sitePort() : config.sitePort(),
    title: config.siteTitle(),
    description: config.siteDescription(),
    author: config.siteAuthor()
  } 

  // Add a JSON property that can be used in templates for debugging
  let jsonObj = {...itemObj}
  itemObj.json = jsonObj

  // debug(itemObj)
  return itemObj
}

module.exports = readGet
