// Given a URL it will search for a webmention endpoint
// If found, it will return the endpoint URL
// If not found, it will return false


const debug = require('debug')('sonniesedge:controllers:webmentions:send')
const fetch = require('node-fetch')
const is = require('is_js')
const cheerio = require('cheerio')

const resolveEndpoint = async (destination, options = {}) => {
  try {
    if (!destination) throw new Error('Required parameter not supplied: destination')
    if (is.not.url(destination)) throw new Error('Parameter must be a URL: destination')

    // get back HTML text
    let res = await fetch(destination, {})
    if (!res.ok) throw new Error(`Received a bad desination: ${res.statusCode}`)

    let resolvedEndpoint = await res.text()

    // convert to traversable DOM
    const $ = cheerio.load(resolvedEndpoint)
    debug($('link').text())

    return resolvedEndpoint
  } catch (error) {
    debug(error)
    throw error
  }
}

module.exports = resolveEndpoint
