const debug = require('debug')('indieweb-express-site:controllers:content:shared:fetchOgData')
const fetch = require('node-fetch')
const is = require('is_js')
const ogs = require('open-graph-scraper');

const fetchOgData = async (data, model, renderMessages = [], options = {}) => {
  try {
    const indiewebFields = ['bookmark_of']

    for (const field of indiewebFields) {
      // if the current field is a field in data
      if (Object.keys(data).includes(field)) {
        let currentUrl = data[field]
        if (is.not.url(currentUrl)) throw new Error('Indieweb field is not a URL')
        if (currentUrl.match('^http(s?)://twitter.com+')) return data // don't try this on twitter

        // Get data
        let results = await ogs({ url: currentUrl })
        // console.log('results: ', results)

        let result = results.result
        if (!result.success) throw new Error('Could not get details for this URL')

        console.log('result: ', result)

        // Add title if it's missing
        if (!data.title && result.ogDescription) data.title = result.ogDescription

        // Add social media image if present
        if ((result.ogImage || result.twitterImage) && !data.opengraph) {
          data.opengraph = {}
          data.opengraph.image = {}

          let sourceImage = result.ogImage || result.twitterImage
          if (sourceImage.url) {
            // TODO: download image file and store in file dir

            data.opengraph.image.filename = sourceImage.url // TODO: Use filename of downloaded image
          }

          if (sourceImage.url && sourceImage.height && sourceImage.height) {
            data.opengraph.image.height = sourceImage.height
            data.opengraph.image.width = sourceImage.width
          }

          renderMessages.push('Added social media image for ' + currentUrl)
        }

        // Fallback to adding screenshot
        if (!result.ogImage && !data.opengraph && !data.opengraph.image) {
          // get screenshot
          // attach metadata to data.opengraph.image
          // save file

          renderMessages.push('Added screenshot for ' + currentUrl)
        }

        // renderMessages.push('Added OG data for ' + currentUrl)
      }
    }

    console.log('data: ', data)

    return data
  } catch (error) {
    console.log(error)
    throw error
  }
}

module.exports = fetchOgData
