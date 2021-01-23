const debug = require('debug')('indieweb-express-site:controllers:content:shared:syndication')
const is = require('is_js')
const syndication = require('../../syndication')

const autoSyndicate = async (model, id, silo = 'twitter', renderMessages, options = {}) => {

  try {

    renderMessages.push(`Syndications waiting be published`)
    debug('Syndications waiting be published')

    let syndicationCreateResults = await syndication.create(model.modelDir, id, silo)

    if (syndicationCreateResults.statusCode === 'SUCCESS') {
      // syndicationCreateResults SUCCESS
      debug(`/${model.modelDir}/${id} syndicated to ${syndicationCreateResults.location}`)
      renderMessages.push(`/${model.modelDir}/${id} syndicated to ${syndicationCreateResults.location}`)

      let syndicationStoreResults = await syndication.store(model.modelDir, id, syndicationCreateResults.location)

      if (syndicationStoreResults.statusCode === 'SUCCESS') {
        // syndicationStoreResults SUCCESS
        debug(`/${model.modelDir}/${id} linked with syndication at ${syndicationCreateResults.location}`)
        renderMessages.push(`/${model.modelDir}/${id} linked with syndication at ${syndicationCreateResults.location}`)
      } else {

        // syndicationStoreResults ERROR
        debug('syndicationStoreResults.statusCode: ', syndicationStoreResults.statusCode)
        renderMessages.push(`syndicationStoreResults ${syndicationStoreResults.statusCode}: ${syndicationStoreResults.statusMessage}`)

        debug('syndicationStoreResults: ', syndicationStoreResults)
        renderMessages.push('syndicationStoreResults: ' + JSON.stringify(syndicationStoreResults))
      }


    } else {
      // syndicationCreateResults ERROR
      debug('syndicationCreateResults.statusCode: ', syndicationCreateResults.statusCode)
      renderMessages.push(`syndicationCreateResults ${syndicationCreateResults.statusCode}: ${syndicationCreateResults.statusMessage}`)

      debug('syndicationCreateResults: ', syndicationCreateResults)
      renderMessages.push('syndicationCreateResults: ' + JSON.stringify(syndicationCreateResults))
    }

    return true
  } catch (error) {
    renderMessages.push(error)
    return renderMessages
  }
}

module.exports = autoSyndicate
