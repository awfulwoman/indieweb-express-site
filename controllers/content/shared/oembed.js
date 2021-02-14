const debug = require('debug')('indieweb-express-site:controllers:content:shared:oEmbed')
const fetch = require('node-fetch')
const is = require('is_js')

const oEmbed = async (data, renderMessages = [], options = {}) => {
  try {
    const indiewebFields = ['like_of', 'repost_of', 'quote_of']

    for (const field of indiewebFields) {    
      // if the current field is a field in data
      if (Object.keys(data).includes(field)) {
        let twitterUrl = data[field]
  
        if (is.not.url(twitterUrl)) throw new Error('Indieweb field is not a URL')
        if (!twitterUrl.match('^http(s?)://twitter.com+')) return data

        let constructedUrl = 'https://publish.twitter.com/oembed?url=' + twitterUrl

        const response = await fetch(constructedUrl)
        const body = await response.json()
  
        data[field + '_oembed_twitter'] = body.html
        renderMessages.push('Added tweet data for ' + twitterUrl)
      }
    }
    return data
  } catch (error) {
    throw error
  }
}

module.exports = oEmbed
