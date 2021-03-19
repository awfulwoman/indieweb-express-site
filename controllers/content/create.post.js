const debug = require('debug')('indieweb-express-site:controllers:content:createPost')
const makeError = require("make-error")

const { validationResult, matchedData } = require('express-validator')
const is = require('is_js')
const path = require('path')
const { DateTime } = require('luxon')

const md = require('../../utilities/markdown-it')
const config = require('../../config')
const shared = require('./shared')
const { create } = require('../../drivers/markdown')
// const webmention = require('../webmentions')

function ContentError(contentErrors) {
  ContentError.super.call(this, 'Content error')
  this.contentErrors = contentErrors
}
makeError(ContentError)

const createPost = async (args) => {
  // Vars accessible by both try and catch
  const renderMessages = []
  let formState = {}
  let formErrors = {}

  try {
    // Clone args object
    const argObj = { ...args }

    formState = shared.flattenFormBody(argObj.body)
    formErrors = shared.flattenFormErrors(argObj.errors)

    const id = DateTime.local().toUTC().toFormat(config.fileDateFormat())

    argObj.content = argObj.sanitizedData.content ? argObj.sanitizedData.content : ' '
    delete argObj.sanitizedData.content

    if (is.not.empty(formErrors)) {
      renderMessages.push('Form errors are present. You need to deal with them.')
      throw new Error('Errors were present')
    }

    argObj.sanitizedData = await shared.metadata(argObj.sanitizedData, renderMessages).catch((error) => { throw error })
    argObj.sanitizedData = await shared.oEmbed(argObj.sanitizedData, renderMessages).catch((error) => { throw error })

    await argObj.model.create(argObj.sanitizedData, argObj.content, id).catch((error) => { throw error })

    // Get list of all files to save
    debug('argObj.files: ', argObj.files)
    if (argObj.files) {
      shared.fileUploads(argObj.model, id, argObj.files, renderMessages, options = {})
    }

    // Syndicate if requested
    if (argObj.body.syndicate_to) {
      for (const syndication in argObj.body.syndicate_to) {
        if (Object.hasOwnProperty.call(argObj.body.syndicate_to, syndication)) {
          await shared.syndicationAuto(argObj.model, id, syndication, renderMessages, {})
        }
      }
    }

    // Store any manually added syndications
    if (argObj.body.manual_syndication) {
      shared.syndicationManual(argObj.model, id, argObj.body.manual_syndication, renderMessages)
    }

    await argObj.model.read(id).catch((error) => { throw error }) // Read to set up cache
    // await webmention.send(data.url).catch((error) => { throw error })

    renderMessages.push('SUCCESS!')

    const successObj = {
      status: 'SUCCESS',
      messages: renderMessages,
      url: `/${argObj.model.modelDir}/${id}`
    }

    debug(successObj)

    return successObj
  } catch (error) {
    const errorObj = {
      status: 'ERROR',
      messages: {
        info: renderMessages
      },
      state: formState,
      errors: formErrors
    }

    debug(errorObj)

    throw new ContentError(errorObj)
  }
}

module.exports = createPost
