const debug = require('debug')('indieweb-express-site:controllers:webmentions:send:sendSingle')
const is = require('is_js')
const dispatch = require('@whalecoiner/webmention-simple-dispatch')

const sendSingle = async (sourceUrl, targetUrl, endpointUrl, options = {}) => {
  try {
    debug('sourceUrl: ', sourceUrl)
    debug('targetUrl: ', targetUrl)
    debug('endpointUrl: ', endpointUrl)

    if (!sourceUrl) throw new Error('sourceUrl must be provided')
    if (!targetUrl) throw new Error('targetUrl must be provided')
    if (!endpointUrl) throw new Error('endpointUrl must be provided')
    if (is.not.url(sourceUrl)) throw new Error('sourceUrl must be a URL')
    if (is.not.url(targetUrl)) throw new Error('targetUrl must be a URL')
    if (is.not.url(endpointUrl)) throw new Error('endpointUrl must be a URL')

    // Send
    await dispatch(endpointUrl, { target: targetUrl, source: sourceUrl }).catch(error => {
      throw (error)
    })
  } catch (error) {
    debug(error)
    throw error
  }
}

module.exports = sendSingle
