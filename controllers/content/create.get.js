const debug = require('debug')('indieweb-express-site:controllers:utils:content:createGet')
const asyncHandler = require('express-async-handler')
const bodyParser = require('body-parser')
const urlencodedParser = bodyParser.urlencoded({ extended: true })
const is = require('is_js')
const tall = require('tall').tall

const AppError = require('../../utilities/app-error')
const md = require('../../utilities/markdown-it')
const config = require('../../config')
const { resolveAlias } = require('../../models/types/article.model')

const createGet = (model, options) => {
  options || (options = {});

  return asyncHandler(async (req, res, next) => {
    let form_state = {}

    // Unshorten any shortened URLs
    let resolvedUrl = req.query.url ? await tall(req.query.url) : undefined

    form_state['title'] = req.query.title
    form_state['content'] = req.query.text
    form_state['url'] = resolvedUrl

    form_state['bookmark_of'] = resolvedUrl
    form_state['like_of'] = resolvedUrl
    form_state['quote_of'] = resolvedUrl
    form_state['reply_to'] = resolvedUrl
    form_state['repost_of'] = resolvedUrl

    let syndicationSilosMissingObj = Array.from(config.silos(), x => {
      return { id: x }
    })

    syndicationSilosMissingObj.forEach(silo => {
      if (silo.id === 'twitter') {
        if (resolvedUrl.includes('twitter.com')) form_state['syndicate_to_twitter'] = silo.syndicate = true
      }
    })

    res.render(options.template || `content-create/types/${model.id}`, {
      data: { title: `Create a new ${model.id}` },
      state: form_state,
      syndicationSilosMissing: syndicationSilosMissingObj
    })
  })
}

module.exports = createGet
