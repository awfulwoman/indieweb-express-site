const debug = require('debug')('indieweb-express-site:controllers:content:updatePost')
const makeError = require("make-error")
const is = require('is_js')
const { DateTime } = require('luxon')

const config = require('../../config')
const shared = require('./shared')
// const webmention = require('../webmentions')

// Custom errors
// TODO: Move to own module
function ContentError(contentErrors) {
  ContentError.super.call(this, 'Content error')
  this.contentErrors = contentErrors
}
makeError(ContentError)

const updatePost = async (args) => {
  // Vars accessible by both try and catch
  const renderMessages = []
  let formState = {}
  let formErrors = {}

  try {
    // Clone args object
    const argObj = { ...args }

    formState = shared.flattenFormBody(argObj.body)
    formErrors = shared.flattenFormErrors(argObj.errors)

    if (!argObj.id) {
      throw new Error('All parameters must be supplied!')
    }

    argObj.content = argObj.sanitizedData.content ? argObj.sanitizedData.content : ' '
    delete argObj.sanitizedData.content

    if (is.not.empty(formErrors)) {
      renderMessages.push('Form errors are present. You need to deal with them.')
      throw new Error('Errors were present')
    }

    argObj.sanitizedData = await shared.metadata(argObj.sanitizedData, renderMessages).catch((error) => {
      debug('Error while adding metadata')
      throw error
    })

    argObj.sanitizedData = await shared.oEmbed(argObj.sanitizedData, renderMessages).catch((error) => {
      debug('Error while adding oEmbed data')
      throw error
    })

    await argObj.model.update(argObj.sanitizedData, argObj.content, argObj.id).catch((error) => {
      debug('Error while updating model item')
      throw error
    })

    // The core item has been saved to markdown.
    // Now to process data held in other files.

    // Use req.files data to look for uploaded files and save them to the item
    if (argObj.files) {
      shared.fileUploads(argObj.model, argObj.id, argObj.files, renderMessages, options = {})
    }

    // Syndicate if requested
    if (argObj.body.syndicate_to) {
      for (const syndication in argObj.body.syndicate_to) {
        if (Object.hasOwnProperty.call(argObj.body.syndicate_to, syndication)) {
          await shared.syndicationAuto(argObj.model, argObj.id, syndication, renderMessages, {})
        }
      }
    }

    // Store any manually added syndications
    if (argObj.body.manual_syndication) {
      shared.syndicationManual(argObj.model, argObj.id, argObj.body.manual_syndication, renderMessages)
    }

    argObj.model.clearCache(argObj.id)
    await argObj.model.read(argObj.id).catch((error) => { throw error }) // Read to set up cache
    // await webmention.send(data.url).catch((error) => { throw error })

    renderMessages.push('SUCCESS!')

    const successObj = {
      status: 'SUCCESS',
      messages: renderMessages,
      url: `/${argObj.model.modelDir}/${argObj.id}`
    }

    debug(successObj)

    return successObj
  } catch (error) {
    const errorObj = {
      status: 'ERROR',
      contentHtml: md.render(error.message),
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

module.exports = updatePost
