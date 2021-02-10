const debug = require('debug')('indieweb-express-site:controllers:webmentions:send:sendSingle')
const is = require('is_js')
const dispatch = require('@whalecoiner/simple-webmention-dispatch')
const resolveEndpoint = require('@whalecoiner/webmention-endpoint-discovery')

const sendSingle = async (sourceUrl, destinationUrl, options = {}) => {
  try {
    // Resolve endpoint
    const endpoint = options.endpoint || await resolveEndpoint(destinationUrl)

    // Send
    await dispatch(endpoint, { target: destinationUrl, source: sourceUrl }).catch(error => {
      throw (error)
    })
  } catch (error) {
    debug(error)
    throw error
  }
}

module.exports = sendSingle
