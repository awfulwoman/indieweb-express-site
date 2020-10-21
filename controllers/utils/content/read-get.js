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

      if (path.extname(resolvedId)) throw(`${model.modelDir}/${resolvedId} not found`)

      if (model.resolveAlias) resolvedId = await model.resolveAlias(resolvedId)
      
      let itemObj = await model.read(resolvedId)

      res.render(options.template || 'page', {
        content: itemObj.rendered,
        data: itemObj.data,
        children: options.children ? await options.children() : null,
        id: itemObj.id,
        storage: itemObj.storage,
        sections: itemObj.sections ? itemObj.sections : null
      })

    } catch (error) {
      debug(error)
      throw new ErrorHandler('404', error)
    }
  })
}

module.exports = readGet
