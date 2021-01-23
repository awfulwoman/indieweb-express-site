const debug = require('debug')('indieweb-express-site:models:utils:create')
const is = require('is_js')
const {markdown} = require('../../drivers')
const matter = require('gray-matter')

const modelCreate = async (dir, cache, data, content, id) => {
  try {
    if (!dir || !cache || !data || !content || !id) throw new Error('You must supply all params')
    if (is.not.object(data)) throw new Error('data must be an object')
    if (is.not.string(content)) throw new Error('Content must be a string')
    if (is.not.string(id)) throw new Error('The file ID must be a string')

    // // Check all property names match those in schema
    // for (const field of data) {
    //   if (!globalFields.fields.hasOwnProperty(data[field])) throw new Error('Illegal property name')
    //   if (!this.fields.hasOwnProperty(data[field])) throw new Error('Illegal property name')
    // }

    await markdown.create(dir, id, matter.stringify(content, data))
    await markdown.read(dir, id)

  } catch (error) {
    throw error
  }
}

module.exports = modelCreate
