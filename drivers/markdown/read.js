const debug = require('debug')('indieweb-express-site:drivers:markdown:read');
const fs = require('fs')
const path = require('path')
const is = require('is_js')
const config = require('../../config')
const AppError = require('../../utilities/app-error')

const read = async (type, id) => {
  try {
    if (!type || !id) throw new Error('markdown.read: Missing parameters')
    if (is.not.string(type) || is.not.string(id)) throw new Error('markdown.read: Parameters must be supplied as strings')

    let destination = path.join(config.contentRoot(), type === 'page' ? '' : type, (type === 'page' && id === 'root') ? '' : id, 'index.md')
    // if (type === 'page') {debug(destination)}

    return await fs.promises.readFile(destination, { encoding: 'utf8' })
  } catch (error) {
    throw error
  }
}

module.exports = read
