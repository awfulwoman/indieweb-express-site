const debug = require('debug')('indieweb-express-site:controllers:content:shared:attachUploadedFiles')
const path = require('path')
const moveFile = require('move-file')

const config = require('../../../config')

const attachFiles = async (model, id, files, renderMessages, options = {}) => {
  try {
    if (!model) throw new Error('Missing paramter: model')
    if (!id) throw new Error('Missing parameter: id')
    if (!files) throw new Error('Missing parameter: files')
    // `files` should be an array of file objects

    for (const file of files) {
      // Each file object will be something like this:
      // {
      //   fieldname: 'images[0][file]',
      //   originalname: 'Screenshot 2021-04-12 at 16.37.48.png',
      //   encoding: '7bit',
      //   mimetype: 'image/png',
      //   destination: '/tmp/attachFiles',
      //   filename: 'images-0-file-20210419t151459-355438633.png',
      //   path: '/tmp/attachFiles/images-0-file-20210419t151459-355438633.png',
      //   size: 1854115
      // }
      const destination = path.join(config.contentRoot(), model.modelDir, id, 'files', file.filename)
      await moveFile(file.path, destination).catch((error) => {
        throw error
      })
      debug(`Image: ${destination}`)
      renderMessages.push(`Image: ${file.filename}`)
    }
  } catch (error) {
    renderMessages.push(error)
    throw error
  }
}

module.exports = attachFiles
