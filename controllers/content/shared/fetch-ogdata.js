const debug = require('debug')('indieweb-express-site:controllers:content:shared:fetchOgData')
const fetch = require('node-fetch')
const path = require('path')
const {createWriteStream} = require('fs')
const {pipeline} = require('stream')
const {promisify} = require('util')
const is = require('is_js')
const ogs = require('open-graph-scraper')
const mkdir = require('mkdirp')
const imageSize = require('image-size')

const config = require('../../../config')

const imageSizePromise = promisify(imageSize)
const streamPipeline = promisify(pipeline)

const fetchOgData = async (data, renderMessages = [], options = {}) => {
  try {

    const indiewebFields = ['bookmark_of']

    for (const field of indiewebFields) {
      // if the current field is a field in data
      if (Object.keys(data).includes(field)) {
        let currentUrl = data[field]
        if (is.not.url(currentUrl)) throw new Error('Indieweb field is not a URL')        
        if (currentUrl.match('^http(s?)://twitter.com+')) return data // don't try this on twitter

        // Get data
        let results = await ogs({url: currentUrl})
        // console.log('results: ', results)

        let result = results.result
        if (!result.success) throw new Error('Could not get details for this URL')

        console.log('result: ', result)

        // Add title if it's missing
        if (!data.title && result.ogDescription) data.title = result.ogDescription

        // Add social media image if present
        if ((result.ogImage || result.twitterImage) && (!data.opengraph || (data.opengraph && !data.opengraph.image))) {
          
          data.opengraph = {}
          data.opengraph.image = {}

          let sourceImage = result.ogImage || result.twitterImage
          if (sourceImage.url) {
            // TODO: download image file and store in file dir
            const download = await fetch(sourceImage.url)
            const url = new URL(sourceImage.url)
            const urlFile = path.basename(url.pathname)

            if (!download.ok) throw new Error(`unexpected response ${download.statusText}`)
            const localDestinationPath = path.join(config.contentRoot(), data.storage, data.id, 'files')
            const localDestination = path.join(localDestinationPath, urlFile)
            await mkdir(localDestinationPath)
            await streamPipeline(download.body, createWriteStream(localDestination))

            data.opengraph.image.filename = urlFile // TODO: Use filename of downloaded image

            if (sourceImage.height && sourceImage.height) {
              data.opengraph.image.height = sourceImage.height
              data.opengraph.image.width = sourceImage.width
            } else {
              const dimensions = await imageSizePromise(localDestination)
              data.opengraph.image.height = dimensions.height
              data.opengraph.image.width = dimensions.width
            }

          }

          renderMessages.push('Added social media image for ' + currentUrl)
        }

        // Fallback to adding screenshot
        if ((!result.ogImage || !result.twitterImage) && (!data.opengraph || (data.opengraph && !data.opengraph.image))) {
          // get screenshot
          // attach metadata to data.opengraph.image
          // save file

          // renderMessages.push('Added screenshot for ' + currentUrl)
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
