const fs = require('fs')
const path = require('path')
const config = require('../../config')
const is = require('is_js')
const debug = require('debug')('sonniesedge:drivers:files:create')
const write = require('write')

async function checkFileExists(file) {
  return fs.promises.access(file, fs.constants.F_OK)
    .then(() => true)
    .catch(() => false)
}

const create = async (type, id, filename, content) => {
  try {
    if (!type || !id || !filename || !content) throw new Error('markdown.read: Missing parameters')
    if (is.not.string(type) || is.not.string(id) || is.not.string(filename)) throw new Error('markdown.read: Parameters must be supplied as strings')

    let destination = path.join(config.contentRoot(), type, id, 'files', filename)

    debug('saving file to: ', destination)

    // check if destination exists
    // if (checkFileExists(destination)) throw new Error(`Error: ${destination} already exists!`)

    await write(destination, content)
      .catch((error) => {
        debug(error)
        throw new Error(`Could not create ${destination}.`)
      })

  } catch (error) {
    debug(error)
    return Promise.reject(error)
  }
}

module.exports = create
