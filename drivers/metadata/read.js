const debug = require('debug')('indieweb-express-site:drivers:markdown:read');
const fs = require('fs')
const path = require('path')
const is = require('is_js')
const config = require('../../config')

const read = async (contentType, contentId, metadataType, filename) => {
  try {
    if (!contentType) throw new Error('markdown.read: Parameter contentType missing')
    if (!contentId) throw new Error('markdown.read: Parameter contentId missing')
    if (!metadataType) throw new Error('markdown.read: Parameter metadataType missing')
    if (!filename) throw new Error('markdown.read: Parameter filename missing')

    if (is.not.string(contentType)) throw new Error('markdown.read: Parameter contentType must be supplied as string')
    if (is.not.string(contentId)) throw new Error('markdown.read: Parameter contentType must be supplied as string')
    if (is.not.string(metadataType)) throw new Error('markdown.read: Parameter metadataType must be supplied as string')
    if (is.not.string(filename)) throw new Error('markdown.read: Parameter filename must be supplied as string')

    let destination = path.join(
      config.contentRoot(), 
      contentType === 'pages' ? '' : contentType, 
      (contentType === 'pages' && contentId === 'root') ? '' : contentId, 
      metadataType, 
      filename
      )

    return await fs.promises.readFile(destination, { encoding: 'utf8' })
  } catch (error) {
    throw error
  }
}

module.exports = read
