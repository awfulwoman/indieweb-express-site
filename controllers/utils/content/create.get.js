const debug = require('debug')('sonniesedge:controllers:base:markdown');
const asyncHandler = require('express-async-handler');
const ErrorHandler = require('../../../utilities/error-handler')
const md = require('../../../utilities/markdown-it')

const bodyParser = require('body-parser')
const urlencodedParser = bodyParser.urlencoded({ extended: true })
const is = require('is_js')

const createGet = (model, options) => {
  options || (options = {});

  return asyncHandler((req, res, next) => {
    let form_state = {}

    form_state['title'] = req.query.title
    form_state['content'] = req.query.body
    form_state['url'] = req.query.url
    
    form_state['bookmark_of'] = req.query.url
    form_state['like_of'] = req.query.url
    form_state['quote_of'] = req.query.url
    form_state['reply_to'] = req.query.url
    form_state['repost_of'] = req.query.url

    debug('Form state: ', form_state)

    res.render(options.template || `content-create/types/${model.modelDir}`, {
      data: { title: `${model.modelDir} creation` },
      state: form_state,
    })
  })
}

module.exports = createGet
