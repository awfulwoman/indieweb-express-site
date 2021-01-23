const debug = require('debug')('indieweb-express-site:controllers:syndication:create')
const is = require('is_js')
const dispatch = require('../../dispatch')
const config = require('../../../config')

const createSyndication = async (modelType, id, syndicationType = 'twitter', syndicationUrl = 'https://brid.gy/publish/webmention', options = {}) => {

  // Essentially a wrapper for brid.gy

  try {

    if (!modelType) throw new Error('Required parameter missing: modelType')
    if (!id) throw new Error('Required parameter missing: id')

    if (is.not.url(syndicationUrl)) throw new Error('parameter syndicationUrl must be a URL')
    if (is.not.string(syndicationType)) throw new Error('parameter syndicationType must be a string')
    if (is.not.string(modelType)) throw new Error('parameter modelType must be a string')
    if (is.not.string(id)) throw new Error('parameter id must be a string')

    // construct syndicationType URL
    let targetUrl = `https://brid.gy/publish/${syndicationType}`

    // construct source URL
    let sourceUrl = `${config.siteUrl()}/${modelType}/${id}`

    debug('syndicationUrl: ', syndicationUrl)
    debug('target: ', targetUrl)
    debug('sourceUrl: ', sourceUrl)
    
    let results = await dispatch(syndicationUrl, {
      target: targetUrl, 
      source: sourceUrl
    })

    debug('Syndication creation raw results from dispatch: ', results)
    
    // Brid.gy sent back an error
    if (results && results.response && results.response.error) throw {
      statusCode: 'ERROR',
      statusMessage: results.response.error,
      httpCode: results.status ? results.status : 500,
      rawResponse: results
    }

    // Error isn't a Brid.gy error but is 400+
    if (parseInt(results.status) > 400) throw {
      statusCode: 'ERROR',
      statusMessage: `Received a ${results.statusCode} error`,
      httpCode: parseInt(results.statusCode),
      rawResponse: results
    }

    if (parseInt(results.status) === 201 && results.response.url) {
      return {
        statusCode: 'SUCCESS',
        statusMessage: `Created a new syndication at ${results.response.url}`,
        httpCode: 201,
        location: results.response.url,
        rawResponse: results
      }
    }

    return {
      statusCode: 'ERROR',
      statusMessage: 'An unknown error occurred',
      httpCode: 500,
      rawResponse: results ? results : 'No response returned'
    }

  } catch (error) {
    // debug(error)
    return error
  }
}

module.exports = createSyndication
