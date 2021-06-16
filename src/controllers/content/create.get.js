const debug = require('debug')('indieweb-express-site:controllers:utils:content:createGet')
const is = require('is_js')
const tall = require('tall').tall

const config = require('../../config')
const shared = require('./shared')

const createGet = async (args) => {
  const argObj = { ...args }

  const formState = {}

  const resolvedUrl = argObj.query.url && is.url(argObj.query.url) ? await tall(argObj.query.url).catch(() => argObj.query.url) : undefined // Unshorten any shortened URLs
  const resolvedTitle = argObj.query.title && is.string(argObj.query.title) ? argObj.query.title : undefined
  const resolvedText = argObj.query.text && is.string(argObj.query.text) ? argObj.query.text : undefined

  formState.title = resolvedTitle
  formState.content = resolvedText
  formState.url = resolvedUrl

  formState.bookmark_of = resolvedUrl
  formState.like_of = resolvedUrl
  formState.quote_of = resolvedUrl
  formState.in_reply_to = resolvedUrl
  formState.repost_of = resolvedUrl

  const syndicationSilos = shared.syndicationSilos(config.silos(), resolvedUrl)

  return {
    data: {
      title: `Create new ${argObj.model.id}`
    },
    state: formState,
    syndicationSilosMissing: syndicationSilos
  }
}

module.exports = createGet
