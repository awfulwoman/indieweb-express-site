const fs = require('fs')
const path = require('path')
const config = require('../config')
const is = require('is_js')

const db = {
  create: async function (type, id, fileContent) {
    if (!type || !fileContent || !id)
      throw new Error('db.create: Missing parameters')
    if (is.not.string(type) || is.not.string(id))
      throw new Error('db.create: Parameters must be supplied as strings')

    let destination = path.join(config.contentRoot, type, id, 'index.md')

    fs.stat(destination, (err, stat) => {
      if (is.not.falsy(err))
        throw new Error('db.create: File already exists')
    });

    return fs.promises.writeFile(destination, message, 'utf8')
  },

  read: async function (type, id) {
    if (!type || !id)
      throw new Error('db.read: Missing parameters')
    if (is.not.string(type) || is.not.string(id))
      throw new Error('db.read: Parameters must be supplied as strings')
    let destination = path.join(config.contentRoot, location, id, 'index.md')

    try {
      let data = fs.promises.readFile(destination)
      return await markdownToObj(data) // TODO: er, create this
    } catch (error) {
      return false // TODO: return a specific error type that can be plugged into a flash message?
    }
  },

  update: async function (type, id, fileContent) {
    if (!type || !fileContent || !id)
      throw new Error('db.update: Missing parameters')
    if (is.not.string(type) || is.not.string(id))
      throw new Error('db.update: Parameters must be supplied as strings')

    let destination = path.join(config.contentRoot, type, id, 'index.md')
    fs.stat(destination, (err, stat) => {
      if (is.falsy(err))
        throw new Error('db.update: No file exists to update')
    });

    return fs.promises.writeFile(destination, message, 'utf8')
  },

  delete: async function (type, id) {

    if (!type || !id)
      throw new Error('db.delete: Missing parameters')
    if (is.not.string(type) || is.not.string(id))
      throw new Error('db.delete: Parameters must be supplied as strings')
    let destination = path.join(config.contentRoot, location, id, 'index.md')

    return fs.promises.unlink(destination)
  }
}

module.exports = db;
