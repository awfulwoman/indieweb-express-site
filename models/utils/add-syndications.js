const debug = require('debug')('indieweb-express-site:models:utils:addSyndication')

const { DateTime } = require('luxon')
const path = require('path')
const fs = require('fs')
const is = require('is_js')
const matter = require('gray-matter')
const fg = require('fast-glob')

const readMetadata = require('../../drivers/metadata/read')
const config = require('../../config')

async function checkFileExists(file) {
  return fs.promises.access(file, fs.constants.F_OK)
    .then(() => true)
    .catch(() => false)
}

const addSyndications = async (resultObject, id, dir, options = {}) => {
  try {
    let syndicationDir = path.join(config.contentRoot(), dir, id, 'syndication')

    if (!await checkFileExists(syndicationDir)) return resultObject

    debug(`Adding syndications for ${dir}/${id}`)

    let syndicationFileResults = await fg('*.json', { cwd: syndicationDir })

    debug('Found syndication files array: ', syndicationFileResults)

    // if length greater 0 loop over
    if (syndicationFileResults.length <= 0) return resultObject

    let syndications = []
    for (const file of syndicationFileResults) {
      let metadata = await readMetadata(dir, id, 'syndication', file)
      let fileData = JSON.parse(metadata)
      syndications.push(fileData)
      debug('syndicationData: ', fileData)
    }

    resultObject.syndications = syndications

    return resultObject

  } catch (error) {
    throw error
  }
}

module.exports = addSyndications
