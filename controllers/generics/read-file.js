const debug = require('debug')('sonniesedge:controllers:note');
const mime = require('mime-types');
const asyncHandler = require('express-async-handler');
const ErrorHandler = require('../../utilities/error-handler')
const files = require('../../drivers/files')

const readFile = asyncHandler(async (req, res, next) => {
  try {
    let readStream = await files.read('notes', req.params.id, req.params.file)
    let fileType = mime.lookup(req.params.file) || 'application/octet-stream'
    if(fileType){res.set('Content-Type', fileType)}
    res.end(readStream)
  } catch (error) {
    debug(error)
    throw new ErrorHandler(404, 'File not found')
  }


})

module.exports = readFile
