const debug = require('debug')('indieweb-express-site:controllers:webmentions:send:resolveEndpoint')
const fetch = require('node-fetch')
const is = require('is_js')
const cheerio = require('cheerio')
const parseHeaders = require('parse-link-header')

const fullUrl = (incomingString, destination) => {

  // Full URL
  if (is.url(incomingString)) return incomingString

  // Relative URL
  const destinationUrl = new URL(destination)
  let combinedUrl = new URL(incomingString, incomingString.startsWith('/') ? destinationUrl.origin : destinationUrl )
  return combinedUrl.href
}

const resolveEndpoint = async (destination, options = {}) => {
  try {
    if (!destination) throw new Error('Required parameter not supplied: destination')
    if (is.not.url(destination)) throw new Error('Parameter must be a URL: destination')

    // get back HTML text
    // TODO: get back just headers initially, then request body if no endpoints found
    let res = await fetch(destination, {
      'method' : 'GET'
    })
    
    if (!res.ok) throw new Error(`Received a bad destination: ${res.statusCode}`)

    // HEADERS
    // Check headers for valid links
    if (res.headers.has('link')) {
      let headers = parseHeaders(res.headers.get('link'))
      if (headers.webmention) return fullUrl(headers.webmention.url, destination)
    }

    // HTML
    // Convert received HTML to parsable DOM
    let resolvedEndpoint = await res.text()
    const root = cheerio.load(resolvedEndpoint)

    // Find all rel="webmention" instances
    let relWebmentions = root('[rel~="webmention"]')

    // Loop over all webmentions, checking for validity.
    // The first valid webmention is always the correct one,
    // so we can return immediately.
    for (const relWebmention of relWebmentions) {
      if (is.existy(relWebmention.attribs.href)) {
        if (is.empty(relWebmention.attribs.href)) return destination
        return fullUrl(relWebmention.attribs.href, destination)
      }
    }

    throw false

  } catch (error) {
    debug(error)
    throw error
  }
}

module.exports = resolveEndpoint
