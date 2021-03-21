const multer = require('multer')
const debug = require('debug')('indieweb-express-site:middleware:processFiles')
const mime = require('mime-types')
const slugify = require('@sindresorhus/slugify')
const { DateTime } = require('luxon')
const config = require('../config')

// const multerMemoryStorage = multer.memoryStorage()
const diskStorage = multer.diskStorage({
  destination: '/tmp/fileuploads',
  filename: function (req, file, cb) {
    debug(file)
    const tempCurrentDate = DateTime.local().toUTC().toFormat(config.fileDateFormat())
    const tempRandomNumber = Math.round(Math.random() * 1E9)
    const uniqueSuffix = tempCurrentDate + '-' + tempRandomNumber
    cb(null, slugify(file.fieldname) + '-' + uniqueSuffix + '.' + mime.extension(file.mimetype))
  }
})
const processUploadedFiles = multer({ storage: diskStorage })

module.exports = processUploadedFiles
