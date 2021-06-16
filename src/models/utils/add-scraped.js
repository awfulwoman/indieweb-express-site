const debug = require('debug')('indieweb-express-site:models:utils:addScraped')
const path = require('path')
const fs = require('fs')
const fg = require('fast-glob')

const readMetadata = require('../../drivers/metadata/read')
const config = require('../../config')

const fileExists = require('../../utilities/file-exists')

const addScraped = async (resultObject, id, dir, options = {}) => {
  const scrapedDir = path.join(config.contentRoot(), dir, id, 'scraped')

  if (!await fileExists(scrapedDir)) return resultObject

  const metadata = await readMetadata(dir, id, 'scraped', 'opengraph.json')
  const fileData = JSON.parse(metadata)

  resultObject.scraped = fileData

  return resultObject
}

module.exports = addScraped
