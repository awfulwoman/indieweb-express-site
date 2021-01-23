const debug = require('debug')('indieweb-express-site:controllers:content:shared:storeManualSyndication')
const is = require('is_js')
const syndication = require('../../syndication')

const syndicationManual = async (model, id, syndicationUrl, renderMessages, options = {}) => {

  try {

    renderMessages.push(`Manual syndication waiting be published`)
    debug('Manual syndication waiting be published')

    if (is.not.url(syndicationUrl)) throw new Error(`Not attempting to store ${syndicationUrl} as it is not a proper URL`)

    // All good, let's go
    let manualSyndicationStoreResults = await syndication.store(model.modelDir, id, syndicationUrl)

    if (!manualSyndicationStoreResults.statusCode === 'SUCCESS') throw new Error(`manualSyndicationStoreResults ${manualSyndicationStoreResults.statusCode}: ${manualSyndicationStoreResults.statusMessage}`)

    // syndicationStoreResults SUCCESS
    debug(manualSyndicationStoreResults.statusCode, manualSyndicationStoreResults.statusMessage)
    renderMessages.push(`/${model.modelDir}/${id} linked with manual syndication at ${syndicationUrl}`)

    return true

  } catch (error) {
    debug(error)
    renderMessages.push(error)
    return false
  }
}

module.exports = syndicationManual
