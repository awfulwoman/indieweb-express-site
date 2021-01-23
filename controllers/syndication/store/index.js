const debug = require('debug')('indieweb-express-site:controllers:syndication:store')
const is = require('is_js')
const { DateTime } = require('luxon')
const {parseDomain, ParseResultType} = require('parse-domain')
const path = require('path')
const fs = require('fs')
const config = require('../../../config')
const siloFromUrl = require('./silo-from-url')

const storeSyndication = async (modeltype, id, syndicationUrl, options = {}) => {

  try {

    debug('modeltype: ', modeltype)
    debug('id: ', id)
    debug('syndicationUrl: ', syndicationUrl)

    if (is.not.string(modeltype)) throw new Error('parameter modelType must be a string')
    if (is.not.string(id)) throw new Error('parameter id must be a string')
    if (is.not.url(syndicationUrl)) throw new Error('parameter syndicationUrl must be a url')

    let silo = siloFromUrl(syndicationUrl)

    let tempCurrentDate = DateTime.local().toUTC()
    let filename = tempCurrentDate.toFormat(config.fileDateFormat()) + '.json'

    let destinationPath = path.join(config.contentRoot(), modeltype, id, 'syndication')
    let destinationPathAndFile = path.join(destinationPath, filename)

    let fileContent = {
      url: syndicationUrl,
      silo: silo,
      created: tempCurrentDate.toISO()
    }

    debug('fileContent: ', fileContent)

    await fs.promises.mkdir(destinationPath)
      .catch((error) => {
        return {
          statusCode: 'ERROR',
          statusMessage: `Could not create ${destinationPath}`,
          rawResponse: error
        }
      })

    await fs.promises.writeFile(destinationPathAndFile, JSON.stringify(fileContent, null, 2))
      .catch((error) => {
        return {
          statusCode: 'ERROR',
          statusMessage: `Could not create ${destinationPathAndFile}`,
          rawResponse: error
        }
      })

    return {
      statusCode: 'SUCCESS',
      statusMessage: `Successfully created ${destinationPathAndFile}`,
      response: fileContent,
      rawResponse: fileContent
    }

  } catch (error) {
    return error
  }
}

module.exports = storeSyndication
