const debug = require('debug')('sonniesedge:controllers:base:file');
const mime = require('mime-types');
const asyncHandler = require('express-async-handler');
const ErrorHandler = require('../../../utilities/error-handler')
const files = require('../../../drivers/files')
const Nodecache = require('node-cache')
const sharp = require('sharp')
let fileCache = new Nodecache()



exports.readGet = function(model, options) {
  if (!model) throw new Error('No model specified')
  return asyncHandler(async (req, res, next) => {
    if (!req.params.id) throw new Error('No item ID specified')
    if (!req.params.file) throw new Error('No filename specified')

    try {

      let cacheKey = `${model.modelDir}/${req.params.id}/${req.params.file}${req.params.size ? '/' + req.params.size : null}`


      // If :size specified, try to get that file size from cache

      // If no size specified, get smallest file size from cache

      // if image not available in cache, retrieve from disk

          // generate requested size with sharp
          let readStream = await files.read(model.modelDir, req.params.id, req.params.file)
          
          const generatedImage = await sharp(readStream)
          .resize({height: 600})
          .toBuffer()
          // store size in cache

          // serve from memory


          // console.log(readStream)

      

      // store retrieved stream in cache


      let fileType = mime.lookup(req.params.file) || 'application/octet-stream'
      if(fileType){res.set('Content-Type', fileType)}
      res.end(generatedImage)
    } catch (error) {
      throw new ErrorHandler(404, 'File not found', error)
    }
  })
}
