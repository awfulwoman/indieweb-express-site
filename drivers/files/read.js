const debug = require('debug')('indieweb-express-site:drivers:files:read')
const fs = require('fs')
const path = require('path')
const config = require('../../config')
const is = require('is_js')

const read = async (type, id, filename) => {
  try {
    if (!type || !id) throw new Error('markdown.read: Missing parameters')
    if (is.not.string(type) || is.not.string(id) || is.not.string(filename)) throw new Error('markdown.read: Parameters must be supplied as strings')

    let destination = path.join(config.contentRoot(), type, id, 'files', filename)

    return await fs.promises.readFile(destination)
  } catch (error) {
    return Promise.reject(error)
  }

}

module.exports = read
