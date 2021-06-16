const debug = require('debug')('indieweb-express-site:drivers:files:read')
const fs = require('fs')
const path = require('path')
const config = require('../../config')
const is = require('is_js')

const read = async (type, id, filename) => {
  try {
    if (!type || !id) throw new Error('markdown.read: Missing parameters')
    if (is.not.string(type) || is.not.string(id) || is.not.string(filename)) throw new Error('markdown.read: Parameters must be supplied as strings')

    let locations = ['scraped/files', 'files']

    for (const location of locations) {
      let destinationFiles = path.join(config.contentRoot(), type, id, location, filename)
      let results = await fs.promises.readFile(destinationFiles).catch((error) => {
        debug(`Error while reading ${destinationFiles}`)
      })
      if (results) return results
    }

  } catch (error) {
    return Promise.reject(error)
  }

}

module.exports = read
