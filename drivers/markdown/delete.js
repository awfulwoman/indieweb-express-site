const debug = require('debug')('indieweb-express-site:drivers:markdown:delete');
const fs = require('fs')
const path = require('path')
const is = require('is_js')
const config = require('../../config')
const AppError = require('../../utilities/app-error')


const del = async (type, id) => {
  try {
    if (!type || !id)
      throw new Error('markdown.del: Missing parameters')
    if (is.not.string(type) || is.not.string(id))
      throw new Error('markdown.del: Parameters must be supplied as strings')


    let destination = path.join(config.contentRoot(), location, id, 'index.md')
    debug('destination: ', destination)

    return await fs.promises.unlink(destination)
  } catch (error) {
    return Promise.reject(error)
  }
}

module.exports = del
