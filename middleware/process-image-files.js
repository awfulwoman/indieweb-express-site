const debug = require('debug')('sonniesedge:middleware:processFilesAfterStorage')
const sizeOf = require('image-size')
const isImage = require('is-image')
const qs = require('qs')
const merge = require('deepmerge')

const processImageFiles = (req, res, next) => {
  if (!req.files) next()
  if (!req.uploads) req.uploads = {}
  // let uploadsObj = {}

  for (let originalFile of req.files) {
    let parsedFilesObj = qs.parse(`${originalFile['fieldname']}`, { depth: 2 })

    // If is image
    if (isImage(originalFile.path)) {
      let dimensions = sizeOf(originalFile.path)
      originalFile.width = dimensions.width
      originalFile.height = dimensions.height
    }

    // For every key in parsedFileObj
    for (const [parsedFilesObjKey, parsedFilesObjValue] of Object.entries(parsedFilesObj)) {
      // loop through every array object
      for (const parsedFile of parsedFilesObjValue) {

        parsedFile.file = originalFile.filename

        // in every array object loop through all items in original file
        for (const [parsedFileKey, parsedFileValue] of Object.entries(originalFile)) {
          // add key and value to parsedFile
          parsedFile[parsedFileKey] = parsedFileValue
        }
      }
    }

    req.uploads = merge(req.uploads, parsedFilesObj)
  }

  // req.uploads.push(uploadsObj)


  next()
}

module.exports = processImageFiles
