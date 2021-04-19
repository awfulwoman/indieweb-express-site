const debug = require('debug')('indieweb-express-site:middleware:processUploadedFiles')
const sizeOf = require('image-size')
const isImage = require('is-image')
const qs = require('qs')
const merge = require('deepmerge')
const combineMerge = require('../utilities/combine-merge')


// This is mildly complex because we are uploading files at the same time as uploading form data
// Therefore we have to combine the uploaded files with the relevant form data.
// This is complicated by:
// - renaming the files as they arrive on the server, so that filename information is not exposed
// - using PHP-style structured fieldnames to describe the object that the file should be related to.

// This means that we're going to be changing the submitted form data on-the-fly to include the uploaded file.

const processFiles = (req, res, next) => {
  debug('req.files', req.files)
  if (!req.files) next()
  if (!req.uploads) req.uploads = {}

  // req.files will be something like:
  // [
  //   {
  //     fieldname: 'images[0][file]',
  //     originalname: 'Screenshot 2021-04-12 at 16.37.48.png',
  //     encoding: '7bit',
  //     mimetype: 'image/png',
  //     destination: '/tmp/fileuploads',
  //     filename: 'images-0-file-20210419t135932-566100104.png',
  //     path: '/tmp/fileuploads/images-0-file-20210419t135932-566100104.png',
  //     size: 1854115
  //   }
  // ]


  for (const originalFile of req.files) {

    // If the uploaded file is an image then grab the image dimensions
    // This is simple so let's get it out of the way
    if (isImage(originalFile.path)) {
      const dimensions = sizeOf(originalFile.path)
      originalFile.width = dimensions.width
      originalFile.height = dimensions.height
    }



    // Convert the the VALUE of { fieldname: 'images[0][file]' } into a sparse object,
    // suitable for inserting into a new markdown content file.
    // This is necessary because we are using fieldnames to describe where they should be saved
    const filesObj = qs.parse(`${originalFile['fieldname']}`, { depth: 2 })
    // The resulting object will be something like this:
    // {
    //   images: [
    //     {
    //       'file': ''
    //     }
    //   ]
    // }

    // For every property/value in the newly-created fileObj...
    for (const [filesObjKey, filesObjValue] of Object.entries(filesObj)) {
      // Remember this is for uploading all types of files and there might
      // be many file upload types:
      // {
      //   images: [],
      //   anotherUploadType: []
      // }

      // For each file object within the file upload type...
      for (const file of filesObjValue) {
        // Add on any relevant values from the originally uploaded file
        file.file = originalFile.filename
        if (originalFile.height && originalFile.width) {
          file.height = originalFile.height
          file.width = originalFile.width
        }
        // file.size = originalFile.size
      }
    }

    // Merge the filesObj into req.uploads so that it's available to use
    req.uploads = merge(req.uploads, filesObj)
  }

  // After processing all the uploads, we want to  attach the data object 
  // (but not the actual file) to req.body, so that it can be handled like anything else there
  // In the above example we would end up with `req.body.images`
  for (const uploadGroup in req.uploads) {
    if (Object.hasOwnProperty.call(req.uploads, uploadGroup)) {
      if (req.body[uploadGroup]) {
        req.body[uploadGroup] = merge(req.body[uploadGroup], req.uploads[uploadGroup], { arrayMerge: combineMerge })
      }
    }
  }

  next()
}

module.exports = processFiles
