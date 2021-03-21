const debug = require('debug')('indieweb-express-site:controllers:content:shared:oEmbed')
const fetch = require('node-fetch')
const is = require('is_js')

const oEmbed = async (data, renderMessages = [], options = {}) => {
  const indiewebFields = ['like_of', 'repost_of', 'quote_of']

  for (const field of indiewebFields) {
    // if the current field is a field in data
    if (Object.keys(data).includes(field)) {
      const twitterUrl = data[field]

      if (is.not.url(twitterUrl)) throw new Error('Indieweb field is not a URL')
      if (!twitterUrl.match('^http(s?)://twitter.com+')) return data
      if (data[field + '_oembed_twitter']) return data // data has already been added

      const constructedUrl = 'https://publish.twitter.com/oembed?url=' + twitterUrl
      const response = await fetch(constructedUrl)
      const body = await response.json()

      data[field + '_oembed_twitter'] = body.html
      renderMessages.push(`Embedded: <${twitterUrl}>`)
    }
  }
  return data
}

module.exports = oEmbed
