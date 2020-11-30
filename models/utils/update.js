const debug = require('debug')('sonniesedge:models:utils:update')
const is = require('is_js')
const { markdown } = require('../../drivers')
const matter = require('gray-matter')

/** @description Generic function for updating any model content item.
 * @param {string} dir Storage directory for this kind of content. e.g. 'notes' 
 * @param {object} modelCache A reference to the cache for this model. (nodecache) 
 * @param {object} data Metadata for this item.
 * @param {string} content Item body content, in Markdown format.
 * @param {string} id The file storage ID.
 * @return {Promise}
 */
const modelUpdate = async (dir, modelCache, data, content, id) => {

  try {
    if (!dir || !modelCache || !data || !content || !id) throw new Error('You must supply all params')
    if (is.not.object(data)) throw new Error('data must be an object')
    if (is.not.string(content)) throw new Error('Content must be a string')
    if (is.not.string(id)) throw new Error('The file ID must be a string')
    if (is.not.string(dir)) throw new Error('The dir must be a string')
    // IF data PROPERTIES DO NOT ALL MATCH NOTE FIELDS OR LOCAL FIELDS
    let fileContentAsMarkdown = matter.stringify(content, data)

    // debug(data)
    // debug(content)

    // debug(fileContent)


    markdown.update(dir, id, fileContentAsMarkdown)
    modelCache.del(id)
    modelCache.set(id, {data: data, content: content})
  } catch (error) {
    // TODO Add to error log
    // debug('--------------------------------------')
    // debug('DEBUG INFO FOLLOWS:')
    // debug('--------------------------------------')
    // debug('Param dir: ', dir)
    // debug('Param modelCache: %O', modelCache)
    // debug('Param data: %o', data)
    // debug('Param content: ', content)
    // debug('Param id: ', id)
    // debug('--------------------------------------')
    // debug('')
    // TODO: This should be a simple return error as it's an async function?
    return Promise.reject(error)
  }
}

module.exports = modelUpdate
