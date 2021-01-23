const debug = require('debug')('indieweb-express-site:controllers:webmentions:send:sendSingle')
const is = require('is_js')

const sendSingle = async (sourceUrl, destinationUrl, options = {}) => {
  try {
      // Resolve endpoint
      let endpoint = options.endpoint || await resolveEndpoint(destinationUrl)

      // Send
      await dispatch(endpoint, {target: destinationUrl, source: sourceUrl}).catch(error => {
        throw (error)
      })
  } catch (error) {
    debug(error)
    throw error
  }
}

module.exports = sendSingle
