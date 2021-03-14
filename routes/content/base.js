const debug = require('debug')('indieweb-express-site:controller:base')

// 🏃‍♀️💨 Express
const express = require('express')
const router = express.Router()
const asyncHandler = require('express-async-handler')
const AppError = require('../../utilities/app-error')

// 💅 Models
const models = require('../../models')
const renderNav = require('../../middleware/render-nav')

// 🖕 Middleware
const {fileController, contentController, feedController} = require('../../controllers')

// 🗼 Syndication routes
router.get(`/rss`, feedController.rssGet(models))
router.get(`/json`, feedController.jsonGet(models))
router.get(`/atom`, feedController.atomGet(models))

// 🔓 Public routes
// Handles all markdown-derived content not covered by a type

// 📍 Children
router.get('/:id', [renderNav], asyncHandler(async (req, res) => {
  try {
    const results = await contentController.readGet(models.page, { id: req.params.id })
    debug(results)
    res.render('content-public/types/page', results)
  } catch (error) { throw new AppError(404) }
}))

router.get('/', [renderNav], asyncHandler(async (req, res) => {
  try {
    const results = await contentController.readGet(models.page, { id: 'root', children: models.globalRecentIndex })
    res.render('homepage', results)
  } catch (error) { throw new AppError(404) }
}))

// 📎 Attached files
// router.get(`/${model.modelDir}/:id/:file`, [], fileController.readGet(model))
// router.get(`/${model.modelDir}/:id/:file/:size`, [], fileController.readGet(model))

module.exports = router
