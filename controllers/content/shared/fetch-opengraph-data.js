const debug = require('debug')('indieweb-express-site:controllers:content:shared:fetchOpengraphData')
const fetch = require('node-fetch')
const path = require('path')
const {createWriteStream} = require('fs')
const {pipeline} = require('stream')
const {promisify} = require('util')
const is = require('is_js')
const fs = require('fs')
const ogs = require('open-graph-scraper')
const mkdir = require('mkdirp')
const imageSize = require('image-size')
const fileExists = require('../../../utilities/file-exists')

const config = require('../../../config')

const imageSizePromise = promisify(imageSize)
const streamPipeline = promisify(pipeline)

const fetchOgData = async (data, model, id, renderMessages = [], options = {}) => {
  const ogObj = {}

  try {
    const indiewebFields = ['bookmark_of'] // I can't think of what other indeiweb fields might use OG data
    const scrapedDir = path.join(config.contentRoot(), model.modelDir, id, 'scraped')

    // Check for existing OpenGraph data
    if (fileExists(path.join(scrapedDir, 'opengraph.json'))) throw new Error('Opengraph data already present')

    for (const field of indiewebFields) {
      // if the current indiewebfield is a property in the data object...
      if (Object.keys(data).includes(field)) {
        const currentUrl = data[field]
        if (is.not.url(currentUrl)) throw new Error(`Indieweb field '${field}' does not contain a URL`)
        if (currentUrl.match('^http(s?)://twitter.com+')) return data // don't try this on twitter

        // Get data
        const ogsResponse = await ogs({ url: currentUrl })
        // console.log('ogsResponse: ', ogsResponse)

        let result = ogsResponse.result
        if (!result.success) throw new Error('Could not get Opengraph data for this URL')
        debug('result: ', result)

        await mkdir(scrapedDir)

        // Add title 
        ogObj.title = result.ogDescription

        // Add social media image if present in result, and no ogObj data already exists
        if (result.ogImage || result.twitterImage) {
          ogObj.image = {}

          let sourceImage = result.ogImage || result.twitterImage
          if (sourceImage.url) {
            const downloadImage = await fetch(sourceImage.url)
            const remoteImageUrl = new URL(sourceImage.url)
            const remoteImageFilename = path.basename(remoteImageUrl.pathname)

            if (!downloadImage.ok) throw new Error(`Unexpected response while fetching OG data: ${downloadImage.statusText}`)
            renderMessages.push('Fetched OpenGraph data for ' + field + ' ' + currentUrl)

            const localImageDir = path.join(scrapedDir, 'files')
            const localImageFile = path.join(localImageDir, remoteImageFilename)
            await mkdir(localImageDir)
            await streamPipeline(downloadImage.body, createWriteStream(localImageFile))

            ogObj.image.filename = remoteImageFilename

            if (sourceImage.height && sourceImage.height) {
              ogObj.image.height = sourceImage.height
              ogObj.image.width = sourceImage.width
            } else {
              const dimensions = await imageSizePromise(localImageFile)
              ogObj.image.height = dimensions.height
              ogObj.image.width = dimensions.width
            }

          }

          // renderMessages.push('Added: OG data')
        } // Finish images

        // Fallback to adding screenshot
        // if ((!result.ogImage || !result.twitterImage) && (!data.ogObj || (data.ogObj && !data.ogObj.image))) {
        //   // get screenshot
        //   // attach metadata to data.ogObj.image
        //   // save file

        //   // renderMessages.push('Added screenshot for ' + currentUrl)
        // }



        // SAVE OBJECT
        await fs.promises.writeFile(path.join(scrapedDir, 'opengraph.json'), JSON.stringify(ogObj, null, 2))

        renderMessages.push('Added OpenGraph data for ' + field + ' ' + currentUrl)
      }
    }

    // debug('data: ', data)

    return data
  } catch (error) {
    renderMessages.push(error.message)
    debug(error)
    throw error
  }
}

module.exports = fetchOgData
