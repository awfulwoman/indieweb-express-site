// loop through each content model and setup routes

const debug = require('debug')('indieweb-express-site:routes:content:type')
// 🏃‍♀️💨 Express
const express = require('express')
const router = express.Router()
const { body, validationResult, matchedData } = require('express-validator')
const asyncHandler = require('express-async-handler')
const AppError = require('../../utilities/app-error')

// 💅 Models
const { modelsArray, page } = require('../../models')

// 🖕 Middleware
const { fileController, contentController, feedController, archiveController } = require('../../controllers')
const { requireAuthentication } = require('../../middleware')

const bodyParser = require('body-parser')
const urlencodedParser = bodyParser.urlencoded({ extended: true })

// const createValidators = require('../../../controllers/validators')
const globalSanitizers = require('../../controllers/sanitizers')

const localValidators = [
  body('created').optional({ checkFalsy: true }),
  body('modified').optional({ checkFalsy: true }),
  body('place[latlng]').optional({ checkFalsy: true }).isLatLong(),
  body('bookmark_of').optional({ checkFalsy: true }).isURL(),
  body('like_of').optional({ checkFalsy: true }).isURL(),
  body('quote_of').optional({ checkFalsy: true }).isURL(),
  body('repost_of').optional({ checkFalsy: true }).isURL(),
  body('reply_to').optional({ checkFalsy: true }).isURL(),
  body('add_like').optional({ checkFalsy: true }),
  body('images.*.alt').optional({ checkFalsy: true }),
  body('images.*.file').optional({ checkFalsy: true }),
  body('images.*.width').optional({ checkFalsy: true }),
  body('images.*.height').optional({ checkFalsy: true }),
  body('images.*.size').optional({ checkFalsy: true }),
  body('guid').optional({ checkFalsy: true }),
  body('title').notEmpty().withMessage('You need to add a title'),
  // body('slug').notEmpty().withMessage('You need to add a slug'),
  // body('strapline').notEmpty().withMessage('You need to add a strapline'),
  body('strapline').optional({ checkFalsy: true }),
  body('content').notEmpty().withMessage('You need to write some content')
]

for (const model of modelsArray) {

  // -------------------------
  // 🔐 Protected admin routes
  // -------------------------

  // Create (GET)
  router.get(`/${model.modelDir}/create`, [requireAuthentication], asyncHandler(async (req, res) => {
    try {
      const results = await contentController.createGet({ model: model, query: req.query })
      res.render(`content-create/types/${model.id}`, results)
    } catch (error) { throw new AppError(404, `Could not load /${model.modelDir}/create`, error) }
  }))

  // Create (POST)
  const createPostMiddleware = [requireAuthentication, urlencodedParser, localValidators, globalSanitizers]
  router.post(`/${model.modelDir}/create`, createPostMiddleware, asyncHandler(async (req, res) => {
    try {
      const results = await contentController.createPost({ model: model, sanitizedData: matchedData(req), errors: validationResult(req), body: req.body })
      req.flash('info', results.messages)
      req.session.save(() => res.redirect(results.url))
    } catch (error) {
      error.contentErrors.data = { title: 'Create failed' }
      error.contentMarkdown = 'Create encountered errors.'
      res.render(`content-create/types/${model.id}`, error.contentErrors)
    }
  }))

  // Update (GET)
  router.get(`/${model.modelDir}/:id/edit`, [requireAuthentication], asyncHandler(async (req, res) => {
    try {
      const results = await contentController.updateGet(model)
      res.render(`content-create/types/${model.id}`, results)
    } catch (error) { throw new AppError(404, `Could not load /${model.modelDir}/edit/${req.params.id}`, error) }
  }))

  // Update (POST)
  router.post(`/${model.modelDir}/:id/edit`, [urlencodedParser, requireAuthentication, localValidators, globalSanitizers], asyncHandler(async (req, res) => {
    try {
      const results = await contentController.updatePost(model)
      res.render(`content-create/types/${model.id}`, results)
    } catch (error) { throw new AppError(404, `Could not load /${model.modelDir}/edit/${req.params.id}`, error) }
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
      const results = await contentController.readGet(page, { id: model.modelDir, children: model.recentIndex })
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
  router.get(`/${model.modelDir}/:id/:file`, [], fileController.readGet(model))
  router.get(`/${model.modelDir}/:id/:file/:size`, [], fileController.readGet(model))
}

module.exports = router
