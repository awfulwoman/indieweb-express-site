const is = require('is_js')
const markdown = require('../../drivers/markdown')
const matter = require('gray-matter')

const createBase = async (modelDir, cache, data, content, id) => {
  try {
    if (!data || !content || !id) throw new Error('You must supply all params')
    if (is.not.object(data)) throw new Error('data must be an object')
    if (is.not.string(content)) throw new Error('Content must be a string')
    if (is.not.string(id)) throw new Error('The file ID must be a string')


    // Add globals if they are not present 
    for (const [key, value] of Object.entries(globalFields.fields)) {
      // console.log(`${key}: ${value}`)
      if (!data[key]) {
        data[key] = value.default
      }
    }

    // Check all property names match those in schema
    for (const field of data) {
      if (!globalFields.fields.hasOwnProperty(data[field])) throw new Error('Illegal property name')
      if (!this.fields.hasOwnProperty(data[field])) throw new Error('Illegal property name')
    }

    await markdown.create(modelDir, matter.stringify(data, content), id)
    return cache.set(id)
  } catch (error) {
    // TODO Add to error log
    return Promise.reject(error)
  }
}

module.exports = createBase
