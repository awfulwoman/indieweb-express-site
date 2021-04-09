const debug = require('debug')('indieweb-express-site:controllers:content:readGet')
const is = require('is_js')
const path = require('path')
const shared = require('./shared')

// READ
const readGet = async (model, options = {}) => {
  if (!options.id) { options.id = 'root' }
  if (path.extname(options.id)) throw new Error(`File ${model.modelDir}/${options.id} not found`)
  if (model.resolveAlias) options.id = await model.resolveAlias(options.id)

  const itemObj = await model.read(options.id)
  if (is.falsy(itemObj)) throw new Error(`Could not find ${options.id} in ${model.modelDir}.`)
  if (itemObj.data.private) throw new Error(`${model.modelDir}/${options.id} is private.`)

  let readObj =  {
    content: itemObj.content,
    excerpt: itemObj.excerpt,
    data: itemObj.data,
    children: options.children ? await options.children() : null,
    twitter: itemObj.twitter,
    opengraph: await shared.formatOpengraph(itemObj),
    storageId: itemObj.id,
    storageType: itemObj.storage || 'pages',
    childrenType: options.childrenType,
    syndications: itemObj.syndications,
    webmentions: null,
    sections: itemObj.sections ? itemObj.sections : null,
    url: itemObj.url,
    scraped: itemObj.scraped || null
  }

  let clonedReadObj = {...readObj}
  clonedReadObj.json = readObj

  debug(clonedReadObj)


  return clonedReadObj
}

module.exports = readGet
