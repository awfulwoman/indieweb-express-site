
const debug = require('debug')('indieweb-express-site:controllers:webmentions:send:discoverWebmentionsToSend')
const fetch = require('node-fetch')
const is = require('is_js')
const cheerio = require('cheerio')
const parseHeaders = require('parse-link-header')

const discoverWebmentionsToSend = async (sourceUrl, options = {}) => {
  try {

    // Given a sourceUrl
    if (!sourceUrl) throw new Error(`Required parameter not supplied: sourceUrl`)
    if (is.not.url(sourceUrl)) throw new Error(`Parameter must be a URL: sourceUrl`)

    // get back HTML body
    let res = await fetch(sourceUrl, {
      'method': 'GET'
    }).catch(error => {
      throw error
    })

    if (!res.ok) throw new Error(`Received a bad sourceUrl: ${res.statusCode}`)

    let sourceUrlContents = await res.text()

    // Parse the HTML source
    const root = cheerio.load(sourceUrlContents)
    
    let selectors = [
      // '.h-entry a',
      '.h-entry a.u-in-reply-to',
      '.h-entry a.u-like-of',
      '.h-entry a.u-repost-of',
      '.h-entry a.u-bookmark-of',
      '.h-entry a.u-mention-of',
      '.h-entry a.u-rsvp',
    ].join(', ')

    // Select all links with a webmention verb
    let webmentions = root(selectors)

    // return array IF there are results
    if (webmentions.length > 0) {
      let temp = []
      for (const item of webmentions) {
        temp.push(item.attribs.href)
      }

      return temp
    } 

    // OTHERWISE throw an error to reject the promise
    throw false

  } catch (error) {
    debug(error)
    throw error
  }
}

module.exports = discoverWebmentionsToSend
