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
const captureWebsite = require('capture-website')
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
    const localImageDir = path.join(scrapedDir, 'files')

    // Check for existing OpenGraph data
    if (await fileExists(path.join(scrapedDir, 'opengraph.json'))) throw new Error('Opengraph: data already present')

    // Loop over the fields. This is very lazy and simply overwrites anything preceding it
    for (const field of indiewebFields) {
      // if the current indiewebfield is a property in the data object...
      if (Object.keys(data).includes(field)) {
        const currentUrl = data[field]
        if (is.not.url(currentUrl)) throw new Error(`Indieweb field does not contain a URL`)
        if (currentUrl.match('^http(s?)://twitter.com+')) return data // don't try this on twitter

        // Fetch data
        const ogsResponse = await ogs({ url: currentUrl })

        let result = ogsResponse.result
        if (!result.success) throw new Error('Could not get Opengraph data for this URL')
        renderMessages.push('OpenGraph: fetched data')

        await mkdir(scrapedDir)

        ogObj.image = {}

        // Add metadata 
        if (result.ogTitle) ogObj.title = result.ogTitle
        if(result.ogDescription) ogObj.description = result.ogDescription
        if(result.ogSiteName) ogObj.siteName = result.ogSiteName

        // Add social media image if present in result, and no ogObj data already exists
        if (result.ogImage || result.twitterImage) {
          let sourceImage = result.ogImage || result.twitterImage
          if (sourceImage.url) {
            const remoteImageUrl = new URL(sourceImage.url)
            const remoteImageFilename = path.basename(remoteImageUrl.pathname)
            const localImageFile = path.join(localImageDir, remoteImageFilename)

            const downloadImage = await fetch(sourceImage.url).catch((error) => {
              debug(`Error while fetching ${sourceImage.url}`)
              throw error
            })
            if (!downloadImage.ok) throw new Error(`Unexpected response while fetching OG data: ${downloadImage.statusText}`)
            renderMessages.push('OpenGraph: fetched image')

            await mkdir(localImageDir).catch((error) => {
              debug(`Error while creating directory ${localImageDir}`)
              throw error
            })
            await streamPipeline(downloadImage.body, createWriteStream(localImageFile)).catch((error) => {
              debug(`Error while saving file ${localImageFile}`)
              throw error
            })
            renderMessages.push('OpenGraph: saved image')

            ogObj.image.filename = remoteImageFilename
            if (sourceImage.type) ogObj.image.type = sourceImage.type
            if (sourceImage.height && sourceImage.height) {
              ogObj.image.height = sourceImage.height
              ogObj.image.width = sourceImage.width
            } else {
              const dimensions = await imageSizePromise(localImageFile).catch((error) => {
                debug('Error while getting dimensions of OpenGraph image')
                throw error
              })
              ogObj.image.height = dimensions.height
              ogObj.image.width = dimensions.width
            }
          }
        } else {
          // Fallback to fetching and adding a screenshot
          const localImageFile = path.join(localImageDir, 'screenshot.png')
          debug('localImageFile: ', localImageFile)
          await mkdir(localImageDir).catch((error) => {
            debug(`Error while creating directory ${localImageDir}`)
            throw error
          })
          await captureWebsite.file(currentUrl, localImageFile).catch((error) => {
            debug('Error while capturing website screenshot')
            throw error
          })
          const dimensions = await imageSizePromise(localImageFile).catch((error) => {
            debug('Error while getting image dimensions of screenshot')
            throw error
          })
          debug('dimensions: ', dimensions)
          ogObj.image.filename = 'screenshot.png'
          ogObj.image.type = 'png'
          ogObj.image.height = dimensions.height
          ogObj.image.width = dimensions.width
          renderMessages.push('OpenGraph: fetched and saved screenshot')
        }
      }
    }

    // SAVE OBJECT
    await fs.promises.writeFile(path.join(scrapedDir, 'opengraph.json'), JSON.stringify(ogObj, null, 2))
    renderMessages.push('OpenGraph: saved data')

    return data
  } catch (error) {
    renderMessages.push(error.message)
    throw error
  }
}

module.exports = fetchOgData
