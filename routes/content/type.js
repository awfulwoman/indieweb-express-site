// loop through each content model and setup routes

const debug = require('debug')('indieweb-express-site:routes:content:types')
// 🏃‍♀️💨 Express
const express = require('express')
const router = express.Router()
const { validationResult, matchedData, checkSchema } = require('express-validator')
const asyncHandler = require('express-async-handler')
const AppError = require('../../utilities/app-error')
const processFiles = require('../../middleware/process-files')
const processUploadedFiles = require('../../middleware/process-uploaded-files')
const md = require('../../utilities/markdown-it')

// 💅 Models
const models = require('../../models')

// 🖕 Middleware
const { fileController, contentController, feedController, archiveController } = require('../../controllers')
const { requireAuthentication } = require('../../middleware')

// const bodyParser = require('body-parser')
// const urlencodedParser = bodyParser.urlencoded({ extended: true })

// const createValidators = require('../../../controllers/validators')
// const globalSanitizers = require('../../controllers/sanitizers')

for (const model of models.modelsArray) {
  // debug(model.id, model.structure)
  // debug('model.fields: ', model.fields)
  if (!model.fields || model.fields.length === 0) throw new Error(`${model.id} has no validation fields!`)
  const localValidators = {}
  if (model.fields) model.fields.forEach(field => Object.assign(localValidators, field.validation))
  // debug('localValidators: ', localValidators)
  // debug(checkSchema(localValidators))

  // -------------------------
  // 🔐 Protected admin routes
  // -------------------------

  // Create (GET)
  router.get(`/${model.modelDir}/create`, [requireAuthentication], asyncHandler(async (req, res) => {
    debug(`/${model.modelDir}/create (get)`)
    try {
      const results = await contentController.createGet({ model: model, query: req.query })
      res.render(`content-create/types/${model.id}`, results)
    } catch (error) { throw new AppError(404, `Could not load /${model.modelDir}/create`, error) }
  }))

  // Create (POST)
  const createPostMiddleware = [requireAuthentication, processFiles.any(), processUploadedFiles, checkSchema(localValidators)]
  router.post(`/${model.modelDir}/create`, createPostMiddleware, asyncHandler(async (req, res) => {
    debug(`/${model.modelDir}/create (post)`)
    try {
      const results = await contentController.createPost({
        model: model,
        sanitizedData: matchedData(req),
        errors: validationResult(req).errors,
        body: req.body,
        files: req.files || null
      })
      req.flash('info', results.messages)
      req.session.save(() => res.redirect(results.url))
    } catch (error) {
      error.contentErrors.data = { title: 'Create failed' }
      error.contentHtml = md.render('Create encountered errors.')
      res.render(`content-create/types/${model.id}`, error.contentErrors)
    }
  }))

  // Update (GET)
  router.get(`/${model.modelDir}/:id/edit`, [requireAuthentication], asyncHandler(async (req, res) => {
    try {
      const results = await contentController.updateGet({
        model: model,
        id: req.params.id
      })
      res.render(`content-create/types/${model.id}`, results)
    } catch (error) { throw new AppError(404, `Could not load /${model.modelDir}/edit/${req.params.id}`, error) }
  }))

  // Update (POST)
  const updatePostMiddleware = [requireAuthentication, processFiles.any(), processUploadedFiles, checkSchema(localValidators)]
  router.post(`/${model.modelDir}/:id/edit`, updatePostMiddleware, asyncHandler(async (req, res) => {
    debug(`/${model.modelDir}/edit (post)`)
    try {
      const results = await contentController.updatePost({
        model: model,
        id: req.params.id,
        sanitizedData: matchedData(req),
        errors: validationResult(req).errors,
        body: req.body,
        files: req.files || null
      })
      
      req.flash('info', results.messages)
      req.session.save(() => res.redirect(results.url))
    } catch (error) {
      debug(error)
      error.contentErrors.data = { title: 'Update failed' }
      error.contentHtml = md.render('Update encountered errors.')
      res.render(`content-create/types/${model.id}`, error.contentErrors)
    }
  }))

  // router.get(`/${model.modelDir}/:id/delete`, [requireAuthentication], asyncHandler(async (req, res) => {
  //   try {
  //     const results = await contentController.deleteGet(model)
  //     res.render(`content-create/types/${model.id}`, results)
  //   } catch (error) { throw new AppError(404, `Could not load /${model.modelDir}/delete/${req.params.id}`, error) }
  // }))

  // router.post(`/${model.modelDir}/:id/delete`, [urlencodedParser, requireAuthentication, createValidators, localValidators, globalSanitizers], asyncHandler(async (req, res) => {
  //   try {
  //     const results = await contentController.deletePost(model)
  //     res.render(`content-create/types/${model.id}`, results)
  //   } catch (error) { throw new AppError(404, `Could not load /${model.modelDir}/delete/${req.params.id}`, error) }
  // }))

  // ---------------------
  // 🔓 Public routes
  // ---------------------

  // 🗼 Syndication routes
  router.get(`/${model.modelDir}/rss`, feedController.rssGet(model))
  router.get(`/${model.modelDir}/json`, feedController.jsonGet(model))
  router.get(`/${model.modelDir}/atom`, feedController.atomGet(model))

  // 📜 Archives routes
  router.get(`/${model.modelDir}/archive/:year?/:month?/:day?`, [], asyncHandler(async (req, res) => {
    try {
      const results = await archiveController(model, { year: req.params.year, month: req.params.month, day: req.params.day })
      res.render('archive/default', results)
    } catch (error) { throw new AppError(404, '', error) }
  }))

  // 📌 Index
  router.get(`/${model.modelDir}`, [], asyncHandler(async (req, res) => {
    try {
      const results = await contentController.readGet(models.page, { id: model.modelDir, children: model.recentIndex })
      res.render('content-public/index', results)
    } catch (error) { throw new AppError(404, null, error) }
  }))

  // 📍 Children
  router.get(`/${model.modelDir}/:id`, [], asyncHandler(async (req, res) => {
    try {
      const results = await contentController.readGet(model, { id: req.params.id })
      // results.log = req.flash('info') || null
      res.render(`content-public/types/${model.id}`, results)
    } catch (error) { throw new AppError(404, null, error) }
  }))

  // 📎 Attached files
  router.get(`/${model.modelDir}/:id/f/:file`, [], fileController.readGet(model))
  router.get(`/${model.modelDir}/:id/f/:file/:size`, [], fileController.readGet(model))
}

module.exports = router
