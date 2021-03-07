const debug = require('debug')('indieweb-express-site:routes:content:types:quote')
// 🏃‍♀️💨 Express
const express = require('express')
const router = express.Router()
const { body } = require('express-validator')
const asyncHandler = require('express-async-handler')
const AppError = require('../../../utilities/app-error')

// 💅 Models
const model = require('../../../models/types/quote.model')
const page = require('../../../models/types/page.model')
const renderNav = require('../../../middleware/render-nav')

// 🖕 Middleware
const { fileController, contentController, feedController, archiveController } = require('../../../controllers')
const checkAuthentication = require('../../../middleware/check-authentication')

const bodyParser = require('body-parser')
const urlencodedParser = bodyParser.urlencoded({ extended: true })

const createValidators = require('../../../controllers/validators')
const createSanitizers = require('../../../controllers/sanitizers')

// 🔐 Protected routes 
router.get(`/${model.modelDir}/create`, [renderNav, checkAuthentication], contentController.createGet(model))
router.post(`/${model.modelDir}/create`, [renderNav, urlencodedParser, checkAuthentication, createValidators, createSanitizers], contentController.createPost(model))
router.get(`/${model.modelDir}/:id/edit`, [renderNav, checkAuthentication], contentController.updateGet(model))
router.post(`/${model.modelDir}/:id/edit`, [renderNav, urlencodedParser, checkAuthentication, createValidators, createSanitizers], contentController.updatePost(model))
// router.get(`/${model.modelDir}/:id/delete`, [renderNav, checkAuthentication], contentController.deleteGet(model))
// router.post(`/${model.modelDir}/:id/delete`, [renderNav, urlencodedParser, checkAuthentication], contentController.deletePost(model))

// ---------------------
// 🔓 Public routes
// ---------------------

// 🗼 Syndication routes
router.get(`/${model.modelDir}/rss`, feedController.rssGet(model))
router.get(`/${model.modelDir}/json`, feedController.jsonGet(model))
router.get(`/${model.modelDir}/atom`, feedController.atomGet(model))

// 📜 Archives routes
router.get(`/${model.modelDir}/archive/:year?/:month?/:day?`, [renderNav], asyncHandler(async (req, res) => {
  try {
    const results = await archiveController(model, { year: req.params.year, month: req.params.month, day: req.params.day })
    res.render('archive/default', results)
  } catch (error) { throw new AppError(404, '', error) }
}))

// 📌 Index
router.get(`/${model.modelDir}`, [renderNav], asyncHandler(async (req, res) => {
  try {
    const results = await contentController.readGet(page, { id: model.modelDir, children: model.recentIndex })
    res.render('content-public/index', results)
  } catch (error) { throw new AppError(404, null, error) }
}))

// 📍 Children
router.get(`/${model.modelDir}/:id`, [renderNav], asyncHandler(async (req, res) => {
  try {
    const results = await contentController.readGet(model, { id: req.params.id })
    res.render(`content-public/types/${model.id}`, results)
  } catch (error) { throw new AppError(404, null, error) }
}))

// 📎 Attached files
router.get(`/${model.modelDir}/:id/:file`, [], fileController.readGet(model))
router.get(`/${model.modelDir}/:id/:file/:size`, [], fileController.readGet(model))

module.exports = router
