const debug = require('debug')('indieweb-express-site:controllers:content:updatePost')
const asyncHandler = require('express-async-handler')
const { validationResult, matchedData } = require('express-validator')
const is = require('is_js')

const moveFile = require('move-file')
const path = require('path')

const normalizeFormState = require('../../utilities/form-normalize-state')
const normalizeFormErrors = require('../../utilities/form-normalize-errors')

const md = require('../../utilities/markdown-it')
const config = require('../../config')
const shared = require('./shared')
const syndication = require('../syndication')

const updatePost = (model, options = {}) => {

  return asyncHandler(async (req, res, next) => {
    let formState = {}
    let formErrors = {}
    let renderMessages = []

    try {
      if (!req.params.id) throw new Error('All parameters must be supplied!')
      let id = req.params.id
      debug('ID: ', id)

      // These will go back to the form if there are errors
      formState = normalizeFormState(req)
      formErrors = normalizeFormErrors(req)

      debug('formState: ', formState)
      debug('formErrors: ', formErrors)

      if (is.not.empty(formErrors)) {
        debug(formErrors)
        res.render(options.template || `content-create/types/${model.id}`, {
          data: { title: `${model.modelDir} update error` },
          content: md.render('There were errors while updating the item.'),
          state: formState,
          errors: formErrors
        })
      } else {

        let data = matchedData(req)
        debug('matchedData: ', data)

        let content = matchedData(req).content ? matchedData(req).content : ' '
        delete data.content

        let metaDataResult = shared.metadata(data)
        data = metaDataResult.data
        renderMessages.push(...metaDataResult.messages)

        debug('Data to update with: ', data)

        await model.update(data, content, id).catch((error) => {
          throw error
        })

        // TODO: add files function
        // Get list of all files to save
        if (req.files) shared.fileUploads(model, id, req.files, renderMessages, options = {})

        renderMessages.push(`/${model.modelDir}/${id} updated!`)

        // Syndicate if necessary
        if (req.body.syndicate_to) {
          for (const syndication in req.body.syndicate_to) {
            if (Object.hasOwnProperty.call(req.body.syndicate_to, syndication)) {
              await shared.syndicationAuto(model, id, syndication, renderMessages, {})
            }
          }
        }

        // Store any manually added syndications
        if (req.body.manual_syndication) shared.syndicationManual(model, id, req.body.manual_syndication, renderMessages)

        model.clearCache(id)
        await model.read(id).catch((error) => {
          throw error
        })

        res.render(options.template || `content-create/default`, {
          data: { title: `/${model.modelDir}/${id} updated` },
          content: `/${model.modelDir}/${id} was successfully updated!`,
          messages: renderMessages,
          url: `/${model.modelDir}/${id}`
        })
      }
    } catch (error) {
      // TODO: Ideally any rendering should be handled by the router
      debug('ERROR!:', error)
      res.render(options.template || `content-create/default`, {
        data: { title: `Update failed` },
        content: `Update encountered errors.`,
        messages: renderMessages,
        rawError: error
      })
    }
  })
}

module.exports = updatePost
