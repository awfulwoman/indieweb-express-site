const debug = require('debug')('indieweb-express-site:controllers:webmentions:send:sendMultiple')
const is = require('is_js')
const dispatch = require('@whalecoiner/webmention-simple-dispatch')
const discoverWebmentionsToSend = require('@whalecoiner/webmention-find-links')
const resolveEndpoint = require('@whalecoiner/webmention-endpoint-discovery')

const sendMultiple = async (sourceUrl, options = {}) => {
  const outputData = []

  try {
    debug('sourceUrl: ', sourceUrl)

    if (!sourceUrl) throw new Error('sourceUrl must be provided')
    if (is.not.url(sourceUrl)) throw new Error('sourceUrl must be a URL')

    const webmentions = await discoverWebmentionsToSend(sourceUrl)

    for (const webmention of webmentions) {
      const resolvedEndpoint = await resolveEndpoint(webmention).catch(error => {
        outputData.push(error)
        throw (error)
      })

      debug('resolvedEndpoint: ', resolvedEndpoint)

      if (is.url(resolvedEndpoint)) {
        const output = await dispatch(resolvedEndpoint, { target: webmention, source: sourceUrl }).catch(error => {
          outputData.push(error)
          throw (error)
        })
        debug('output: ', output)
        outputData.push(output)
      }
    }

    debug('outputData: ', outputData)

    return outputData
  } catch (error) {
    debug('Error: ', error)
    throw error
  }
}

module.exports = sendMultiple
