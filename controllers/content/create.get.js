const debug = require('debug')('indieweb-express-site:controllers:utils:content:createGet')
const asyncHandler = require('express-async-handler')
const is = require('is_js')
const tall = require('tall').tall

const config = require('../../config')

const createGet = (model, options = {}) => {




  return asyncHandler(async (req, res) => {
    const formState = {}

    const resolvedUrl = req.query.url && is.url(req.query.url) ? await tall(req.query.url).catch(() => req.query.url) : undefined // Unshorten any shortened URLs
    const resolvedTitle = req.query.title && is.string(req.query.title) ? req.query.title : undefined
    const resolvedText = req.query.text && is.string(req.query.text) ? req.query.text : undefined

    debug('resolvedUrl: ', resolvedUrl)
    debug('resolvedTitle: ', resolvedTitle)
    debug('resolvedText: ', resolvedText)

    formState.title = resolvedTitle
    formState.content = resolvedText
    formState.url = resolvedUrl

    formState.bookmark_of = resolvedUrl
    formState.like_of = resolvedUrl
    formState.quote_of = resolvedUrl
    formState.reply_to = resolvedUrl
    formState.repost_of = resolvedUrl

    // Convert config array of silos into an array of objects
    const syndicationSilosMissingObj = Array.from(config.silos(), x => {
      const syndicationObj = { id: x }
      if (syndicationObj.id === 'twitter' && resolvedUrl && resolvedUrl.match('^http(s?)://twitter.com+')) {
        syndicationObj.syndicate = true
      }
      return syndicationObj
    })

    // Check to see if any form items should be prefilled
    res.render(options.template || `content-create/types/${model.id}`, {
      data: { title: `Create new ${model.id}` },
      state: formState,
      syndicationSilosMissing: syndicationSilosMissingObj
    })
  })
}

module.exports = createGet
