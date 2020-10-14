const is = require('is_js')
const markdown = require('../../drivers/markdown')
const matter = require('gray-matter')

const modelUpdate = async (dir, data, content, id) => {
  try {
    if (!data || !content || !id) throw new Error('You must supply all params')
    if (is.not.object(data)) throw new Error('data must be an object')
    if (is.not.string(content)) throw new Error('Content must be a string')
    if (is.not.string(id)) throw new Error('The file ID must be a string')
    // IF data PROPERTIES DO NOT ALL MATCH NOTE FIELDS OR LOCAL FIELDS
    return markdown.update(dir, matter.stringify(data, content), id)
  } catch (error) {
    // TODO Add to error log
    return Promise.reject(error)
  }
}

module.exports = modelUpdate
