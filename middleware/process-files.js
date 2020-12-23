const multer = require('multer')
const debug = require('debug')('sonniesedge:middleware:processFiles')
const mime = require('mime-types')
const slugify = require('@sindresorhus/slugify')

// const multerMemoryStorage = multer.memoryStorage()
const diskStorage = multer.diskStorage({
  destination: '/tmp/fileuploads',
  filename: function (req, file, cb) {
    debug(file)
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
    cb(null, slugify(file.fieldname) + '-' + uniqueSuffix + '.' + mime.extension(file.mimetype))
  }
})
const processUploadedFiles = multer({ storage: diskStorage })

module.exports = processUploadedFiles

