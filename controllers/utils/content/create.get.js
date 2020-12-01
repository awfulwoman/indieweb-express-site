const debug = require('debug')('sonniesedge:controllers:utils:content:createGet')
const asyncHandler = require('express-async-handler')
const ErrorHandler = require('../../../utilities/error-handler')
const md = require('../../../utilities/markdown-it')

const bodyParser = require('body-parser')
const urlencodedParser = bodyParser.urlencoded({ extended: true })
const is = require('is_js')
const tall = require('tall').tall

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

    res.render(options.template || `content-create/types/${model.id}`, {
      data: { title: `${model.id} creation` },
      state: form_state,
    })
  })
}

module.exports = createGet
