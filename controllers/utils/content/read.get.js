const debug = require('debug')('sonniesedge:controllers:utils:content:readGet')
const asyncHandler = require('express-async-handler')
const ErrorHandler = require('../../../utilities/error-handler')
const is = require('is_js')
const path = require('path')

// READ
const readGet = (model, options) => {
  options || (options = {});
  return asyncHandler(async (req, res, next) => {
    if (!req.params.id && !options.id) { options.id = 'root' }
    try {

      let resolvedId = options.id || req.params.id

      if (path.extname(resolvedId)) throw(`File ${model.modelDir}/${resolvedId} not found`)

      if (model.resolveAlias) resolvedId = await model.resolveAlias(resolvedId)
      
      let itemObj = await model.read(resolvedId)

      if (is.falsy(itemObj)) throw new Error(`Could not find ${resolvedId} in ${model.modelDir}.`)

      // debug(itemObj)

      res.render(options.template || 'default', {
        content: itemObj.rendered,
        data: itemObj.data,
        children: options.children ? await options.children() : null,
        id: itemObj.id,
        admin: process.env['DEBUG'] || req.isAuthenticated(),
        storage: itemObj.storage,
        sections: itemObj.sections ? itemObj.sections : null
      })

    } catch (error) {
      throw new ErrorHandler('404', 'Could not find this page or content. Have you tried looking under the sofa?', error)
    }
  })
}

module.exports = readGet
