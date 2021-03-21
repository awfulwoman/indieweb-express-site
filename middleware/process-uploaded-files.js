const debug = require('debug')('indieweb-express-site:middleware:processUploadedFiles')
const sizeOf = require('image-size')
const isImage = require('is-image')
const qs = require('qs')
const merge = require('deepmerge')
const combineMerge = require('../utilities/combine-merge')

const processFiles = (req, res, next) => {
  debug('req.files', req.files)
  if (!req.files) next()
  if (!req.uploads) req.uploads = {}
  // let uploadsObj = {}

  for (const originalFile of req.files) {
    // debug('original file fieldname', `${originalFile['fieldname']}`)
    // debug('original file fieldname', originalFile['fieldname'])
    const parsedFilesObj = qs.parse(`${originalFile['fieldname']}`, { depth: 2 })

    debug('parsedFilesObj', parsedFilesObj)

    // If is image
    if (isImage(originalFile.path)) {
      const dimensions = sizeOf(originalFile.path)
      originalFile.width = dimensions.width
      originalFile.height = dimensions.height
    }

    // For every key in parsedFileObj
    for (const [parsedFilesObjKey, parsedFilesObjValue] of Object.entries(parsedFilesObj)) {
      // loop through every array object
      // debug('loop through every array object')
      // debug('parsedFilesObjValue: ', parsedFilesObjValue)
      for (const parsedFile of parsedFilesObjValue) {
        // debug('parsedFile: ', parsedFile)
        parsedFile.file = originalFile.filename

        // in every array object loop through all items in original file
        for (const [parsedFileKey, parsedFileValue] of Object.entries(originalFile)) {
          // debug('add key and value to parsedFile')
          // debug(parsedFileKey, parsedFileValue)
          // add key and value to parsedFile
          parsedFile[parsedFileKey] = parsedFileValue
        }
      }
    }

    req.uploads = merge(req.uploads, parsedFilesObj)

    // debug('req.uploads')
    // debug(req.uploads)
  }

  for (const uploadGroup in req.uploads) {
    if (Object.hasOwnProperty.call(req.uploads, uploadGroup)) {
      // debug('uploadGroup')
      // debug(uploadGroup)

      // debug('req.uploads[uploadGroup]')
      // debug(req.uploads[uploadGroup])

      if (req.body[uploadGroup]) req.body[uploadGroup] = merge(req.body[uploadGroup], req.uploads[uploadGroup], { arrayMerge: combineMerge })
    }
  }

  // req.uploads.push(uploadsObj)

  next()
}

module.exports = processFiles
