const debug = require('debug')('indieweb-express-site:drivers:markdown:create');
const fs = require('fs')
const path = require('path')
const is = require('is_js')
const config = require('../../config')
const AppError = require('../../utilities/app-error')

const create = async (type, id, fileContent) => {
  try {
    if (!type || !fileContent || !id) throw new Error('markdown.create: Missing parameters')
    if (is.not.string(type) || is.not.string(id)) throw new Error('markdown.create: Parameters must be supplied as strings')

    let destinationPath = path.join(config.contentRoot(), type, id)
    let destinationPathAndFile = path.join(destinationPath, 'index.md')

    await fs.promises.mkdir(destinationPath)
      .catch((error) => {
        throw error
      })

    await fs.promises.writeFile(destinationPathAndFile, fileContent)
      .catch((error) => {
        throw new Error(`Could not create ${type}/${id}.`)
      })

  } catch (error) {
    throw error
  }
}

module.exports = create
