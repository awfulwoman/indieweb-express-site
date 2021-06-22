const debug = require('debug')('indieweb-express-site:models:utils:addSyndications')
const path = require('path')
const fs = require('fs')
const fg = require('fast-glob')

const readMetadata = require('../../drivers/metadata/read')
const config = require('../../config')

async function checkFileExists(file) {
  return fs.promises.access(file, fs.constants.F_OK)
    .then(() => true)
    .catch(() => false)
}

const addSyndications = async (resultObject, id, dir, options = {}) => {
  const syndicationDir = path.join(config.contentRoot(), dir, id, 'syndication')

  if (!await checkFileExists(syndicationDir)) return resultObject

  const syndicationFileResults = await fg('*.json', { cwd: syndicationDir })

  // if length greater 0 loop over
  if (syndicationFileResults.length <= 0) return resultObject

  const syndications = []
  for (const file of syndicationFileResults) {
    const metadata = await readMetadata(dir, id, 'syndication', file)
    const fileData = JSON.parse(metadata)
    syndications.push(fileData)
  }

  resultObject.syndications = syndications

  return resultObject
}

module.exports = addSyndications
