const debug = require('debug')('indieweb-express-site:controllers:file');
const mime = require('mime-types');
const asyncHandler = require('express-async-handler');
const AppError = require('../../utilities/app-error')
const files = require('../../drivers/files')
const Nodecache = require('node-cache')
const sharp = require('sharp');
const is = require('is_js');
let fileCache = new Nodecache()

const readGet = (model, options) => {
  if (!model) throw new Error('No model specified')
  
  return asyncHandler(async (req, res, next) => {
    if (!req.params.id) throw new Error('No item ID specified')
    if (!req.params.file) throw new Error('No filename specified')

    try {

      let allowedImageSizes = [100, 300, 600, 900, 1200]

      let resolvedId = req.params.id
      if (model.resolveAlias) resolvedId = await model.resolveAlias(resolvedId)

      let cacheKey = `${model.modelDir}/${resolvedId}/${req.params.file}${req.params.size ? '/' + req.params.size : ''}`

      let fileType = mime.lookup(req.params.file) || 'application/octet-stream'
      if (fileType) res.set('Content-Type', fileType)

      let imageWidth = req.params.size && is.inArray(parseInt(req.params.size), allowedImageSizes) ? parseInt(req.params.size) : 100

      switch (fileCache.has(cacheKey)) {
        case true:
          debug(`calling ${cacheKey} from cache`)
          let buffer = fileCache.get(cacheKey)
          // debug('image size: ', buffer.length)
          res.set('Content-Length', buffer.length)
          res.send(buffer)
          break

        case false:
          let readStream = await files.read(model.modelDir, resolvedId, req.params.file)

          const generatedImage = await sharp(readStream)
            .rotate()
            .resize({ width: imageWidth })
            .toBuffer()
          fileCache.set(cacheKey, generatedImage)
          // debug('image size: ', generatedImage.length)
          res.set('Content-Length', generatedImage.length)
          res.send(generatedImage)
          break

        default:
          throw new Error('Should never get here')
          break
      }

    } catch (error) {
      throw new AppError(404, 'File not found', error)
    }
  })
}

module.exports = readGet
