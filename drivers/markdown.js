const debug = require('debug')('sonniesedge:drivers:markdown');
const fs = require('fs')
const path = require('path')
const config = require('../config')
const is = require('is_js')
const ErrorHandler = require('../utilities/error-handler')

module.exports = {
  create: async function (type, id, fileContent) {
    try {
      if (!type || !fileContent || !id) throw new Error('markdown.create: Missing parameters')
      if (is.not.string(type) || is.not.string(id)) throw new Error('markdown.create: Parameters must be supplied as strings')

      let destination = path.join(config.contentRoot, type, id, 'index.md')

      fs.stat(destination, (err, stat) => {
        if (is.not.falsy(err)) throw new Error('markdown.create: File already exists')
      });

      return await fs.promises.writeFile(destination, message, 'utf8')
    } catch (error) {
      // TODO Add to error log
      return Promise.reject(error)
    }
  },

  read: async function (type, id) {
    try {
      if (!type || !id) throw new Error('markdown.read: Missing parameters')
      if (is.not.string(type) || is.not.string(id)) throw new Error('markdown.read: Parameters must be supplied as strings')

      let destination = path.join(config.contentRoot, type === 'static' ? '' : type, (type === 'static' && id === 'root') ? '' :id, 'index.md')
      // if (type === 'static') {debug(destination)}
      
      return await fs.promises.readFile(destination, { encoding: 'utf8' })
    } catch (error) {
      throw error
    }
  },

  update: async function (type, id, fileContent) {
    try {
      if (!type || !fileContent || !id) throw new Error('markdown.update: Missing parameters')
      if (is.not.string(type) || is.not.string(id)) throw new Error('markdown.update: Parameters must be supplied as strings')

      let destination = path.join(config.contentRoot, type, id, 'index.md')

      fs.stat(destination, (err, stat) => {
        if (is.falsy(err)) throw new Error('markdown.update: No file exists to update')
      });

      return await fs.promises.writeFile(destination, message, 'utf8')
    } catch (error) {
      return Promise.reject(error)
    }
  },

  delete: async function (type, id) {
    try {
      if (!type || !id)
        throw new Error('markdown.delete: Missing parameters')
      if (is.not.string(type) || is.not.string(id))
        throw new Error('markdown.delete: Parameters must be supplied as strings')

      let destination = path.join(config.contentRoot, location, id, 'index.md')

      return await fs.promises.unlink(destination)
    } catch (error) {
      return Promise.reject(error)
    }
  }
}

