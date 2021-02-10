const debug = require('debug')('indieweb-express-site:controllers:content:shared:oEmbed')
const fetch = require('node-fetch')
const is = require('is_js')


const oEmbed = async (data, renderMessages = [], options = {}) => {
  // if URL is twitter.com/whatever
  // if is not URL return data
  // if (!URL.match('^http(s?)://twitter.com+')) return data

  // fetch url via https://publish.twitter.com/oembed?url=https://twitter.com/TwitterDev

  // const res = await fetch('https://publish.twitter.com/oembed?url=' + whatever, {
  //   method: options.method || 'GET'
  // })

  // add results.html as data.twitter_html = results

  return data
}

module.exports = oEmbed
