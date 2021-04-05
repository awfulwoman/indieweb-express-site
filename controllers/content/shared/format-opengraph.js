const debug = require('debug')('indieweb-express-site:controllers:content:shared:formatOpengraph')
const config = require('../../../config')

const formatOpengraph = async (itemObj) => {
  debug('itemObj')
  debug(itemObj)

  const imageObj = async () => {

    let defaultImageObj = {
      alt: 'The avatar of Charlie',
      url: config.siteUrl() + '/charlie.png',
      width: '600',
      height: '600',
      twitterCardSize: 'summary'
    }

    // There's explicitly defined opengraph data in the frontmatter, with image properties
    if (itemObj.data && itemObj.data.opengraph && itemObj.data.opengraph.image) {
      // copy object...
      const opengraphImageClone = { ...itemObj.data.opengraph.image }

      if (!opengraphImageClone.file) {
        debug('No frontmatter file!')
        return defaultImageObj
      }
      if (!opengraphImageClone.width) {
        debug('No frontmatter width!')
        return defaultImageObj
      }
      if (!opengraphImageClone.height) {
        debug('No frontmatter height!')
        return defaultImageObj
      }
      opengraphImageClone.twitterCardSize = 'summary_large_image'

      return opengraphImageClone
    }

    // There's scraped opengraph data, with an image or screenshot
    if (itemObj.scraped && itemObj.scraped.image) {
      const opengraphImageClone = { ...itemObj.scraped.image }

      if (!opengraphImageClone.filename) {
        debug('No scraped file!')
        return defaultImageObj
      }
      if (!opengraphImageClone.width) {
        debug('No scraped width!')
        return defaultImageObj
      }
      if (!opengraphImageClone.height) {
        debug('No scraped height!')
        return defaultImageObj
      }
      opengraphImageClone.twitterCardSize = 'summary_large_image'

      return opengraphImageClone
    }
  
    // There's nothing else, so provide generic info
    return defaultImageObj
  }

  let imageObjFinal = await imageObj()

  let opengraphObj = {
    twitter: { // specific to twitter cards
      creator: '@sonniesedge',
      card: imageObjFinal.twitterCardSize || 'summary' // will be summary_large_image if has image
    },
    // Generic opengraph from here
    type: 'website',
    title: itemObj.data.title,
    url: itemObj.url,
    description: itemObj.excerpt || (itemObj.scraped && itemObj.scraped.description) || 'A piece of content from whalecoiner.com',
    image: imageObjFinal
  }

  // debug('opengraphObj')
  // debug(opengraphObj)

  return opengraphObj
}

module.exports = formatOpengraph
