const debug = require('debug')('indieweb-express-site:controllers:webmentions:send:sendMultiple')
const is = require('is_js')
const dispatch = require('@whalecoiner/webmention-simple-dispatch')
const discoverWebmentionsToSend = require('@whalecoiner/find-webmention-links')
const resolveEndpoint = require('@whalecoiner/webmention-endpoint-discovery')

const sendMultiple = async (sourceUrl, options = {}) => {
  try {
    // Parse the sourceURL for webmention-relevant data (using discoverWebmentionsToSend).
    // Return array of simple objects: 
    // [
    //    'https://example.com/a-cool-post',
    //    'https://example.com/another-cool-post'
    // ]
    let webmentions = await discoverWebmentionsToSend(sourceUrl)

    for (const webmention of webmentions) {
      // Resolve endpoint
      const endpoint = await resolveEndpoint(destination)

      // Send
      await dispatch(endpoint, { target: webmention, source: sourceUrl }).catch(error => {
        throw (error)
      })
    }
  } catch (error) {
    debug(error)
    throw error
  }
}

module.exports = sendMultiple
