const debug = require('debug')('sonniesedge:drivers:markdown:create');
const fs = require('fs')
const path = require('path')
const is = require('is_js')
const config = require('../../config')
const ErrorHandler = require('../../utilities/error-handler')

const create = async (type, id, fileContent) => {
  try {
    if (!type || !fileContent || !id) throw new Error('markdown.create: Missing parameters')
    if (is.not.string(type) || is.not.string(id)) throw new Error('markdown.create: Parameters must be supplied as strings')

    let destination = path.join(config.contentRoot(), type, id, 'index.md')
    debug('destination: ', destination)

    fs.stat(destination, (err, stat) => {
      if (is.not.falsy(err)) throw new Error('markdown.create: File already exists')
    });

    return await fs.promises.writeFile(destination, message, 'utf8')
  } catch (error) {
    // TODO Add to error log
    return Promise.reject(error)
  }
}

module.exports = create
