const debug = require('debug')('indieweb-express-site:controllers:content:shared:syndicationAuto')
const is = require('is_js')
const syndication = require('../../syndication')

const autoSyndicate = async (model, id, silo = 'twitter', renderMessages, options = {}) => {
  try {
    const syndicationCreateResults = await syndication.create(model.modelDir, id, silo)

    if (syndicationCreateResults.statusCode === 'SUCCESS') {
      // syndicationCreateResults SUCCESS
      renderMessages.push(`Syndicated: <${syndicationCreateResults.location}>`)
      const syndicationStoreResults = await syndication.store(model.modelDir, id, syndicationCreateResults.location)

      if (syndicationStoreResults.statusCode === 'SUCCESS') {
        // syndicationStoreResults SUCCESS
        renderMessages.push('Syndication linked')
      } else {
        // syndicationStoreResults ERROR
        renderMessages.push(`Syndication link: ${syndicationStoreResults.statusCode} - ${syndicationStoreResults.statusMessage}`)
        renderMessages.push(`<code>${JSON.stringify(syndicationStoreResults)}</code>`)
      }
    } else {
      // syndicationCreateResults ERROR
      renderMessages.push(`Syndication: ${syndicationCreateResults.statusCode} - ${syndicationCreateResults.statusMessage}`)
      renderMessages.push(`<code>${JSON.stringify(syndicationCreateResults)}</code>`)
    }

    return true
  } catch (error) {
    renderMessages.push(error)
    return renderMessages
  }
}

module.exports = autoSyndicate
