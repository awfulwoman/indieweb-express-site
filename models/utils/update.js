const debug = require('debug')('indieweb-express-site:models:utils:update')
const is = require('is_js')
const matter = require('gray-matter')

const { markdown } = require('../../drivers')
const normalizeItemObject = require('./normalize-item')

/** @description Generic function for updating any model content item.
 * @param {string} dir Storage directory for this kind of content. e.g. 'notes' 
 * @param {object} modelCache A reference to the cache for this model. (nodecache) 
 * @param {object} data Metadata for this item.
 * @param {string} content Item body content, in Markdown format.
 * @param {string} id The file storage ID.
 * @return {Promise}
 */
const modelUpdate = async (dir, modelCache, data, content, id, options = {}) => {

  try {
    if (!dir || !modelCache || !data || !content || !id) throw new Error('You must supply all params')
    if (is.not.object(data)) throw new Error('data must be an object')
    if (is.not.string(content)) throw new Error('Content must be a string')
    if (is.not.string(id)) throw new Error('The file ID must be a string')
    if (is.not.string(dir)) throw new Error('The dir must be a string')

    let fileContentAsMarkdown = matter.stringify(content, data)
    markdown.update(dir, id, fileContentAsMarkdown)
    
    resultObject = await normalizeItemObject({data: data, content: content}, id, dir, options)

    // modelCache.del(id)
    modelCache.set(id, resultObject)
  } catch (error) {
    return Promise.reject(error)
  }
}

module.exports = modelUpdate
