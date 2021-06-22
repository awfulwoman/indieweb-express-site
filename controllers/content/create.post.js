const debug = require('debug')('indieweb-express-site:controllers:content:createPost')
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

    argObj.id = DateTime.local().toUTC().toFormat(config.fileDateFormat())

    argObj.content = argObj.sanitizedData.content ? argObj.sanitizedData.content : ' '
    delete argObj.sanitizedData.content

    if (is.not.empty(formErrors)) {
      debug('formErrors', formErrors)
      renderMessages.push('Form errors are present. You need to deal with them.')
      for (const propName in formErrors) {
        debug(formErrors[propName])
        renderMessages.push(`🚨 ${propName}: ${formErrors[propName]}`)
      }
      throw new Error('Errors were present')
    }

    argObj.sanitizedData = await shared.metadata(argObj.sanitizedData, renderMessages).catch((error) => {
      renderMessages.push(error.message)
      renderMessages.push('Error while adding metadata')
      throw error
    })

    argObj.sanitizedData = await shared.oEmbed(argObj.sanitizedData, renderMessages).catch((error) => {
      renderMessages.push(error.message)
      renderMessages.push('Error while adding oEmbed data')
      throw error
    })

    await argObj.model.create(argObj.sanitizedData, argObj.content, argObj.id).catch((error) => {
      renderMessages.push(error.message)
      renderMessages.push('Error while creating model item')
      throw error
    })

    // The core item has been saved to markdown.
    // Now to process data held in other files.

    // try to save OpenGraph data
    await shared.fetchOpengraphData(argObj.sanitizedData, argObj.model, argObj.id, renderMessages).catch((error) => {
      debug('Caught an error while fetching OpenGraph data, but not rethrowing because it is not critical')
    })

    // Use req.files data to look for uploaded files and save them to the item
    if (argObj.files) {
      shared.attachFiles(argObj.model, argObj.id, argObj.files, renderMessages, options = {})
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

    await argObj.model.read(argObj.id).catch((error) => { throw error }) // Read to set up cache
    // await webmention.send(data.url).catch((error) => { throw error })

    renderMessages.push('Item created!')

    const successObj = {
      status: 'SUCCESS',
      messages: renderMessages,
      url: `/${argObj.model.modelDir}/${argObj.id}`
    }

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

    debug(error)
    debug(errorObj)

    throw new ContentError(errorObj)
  }
}

module.exports = createPost
