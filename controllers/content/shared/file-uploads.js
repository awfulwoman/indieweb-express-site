const debug = require('debug')('indieweb-express-site:controllers:content:shared:fileUploads')
const path = require('path')
const moveFile = require('move-file')

const config = require('../../../config')

const fileUploads = async (model, id, files, renderMessages, options = {}) => {
  try {
    if (!model) throw new Error(`Missing paramter: model`)
    if (!id) throw new Error(`Missing parameter: id`)
    if (!files) throw new Error(`Missing parameter: files`)

    for (const file of files) {
      let destination = path.join(config.contentRoot(), model.modelDir, id, 'files', file.filename)
      await moveFile(file.path, destination).catch((error) => {
        throw error
      })
      debug(`Added image ${destination}`)
      renderMessages.push(`Added image ${destination}`)
    }
  } catch (error) {
    renderMessages.push(error)
    throw error
  }
}

module.exports = fileUploads
