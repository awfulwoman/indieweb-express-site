const debug = require('debug')('indieweb-express-site:routes:archive')
const express = require('express')
const router = express.Router()
const asyncHandler = require('express-async-handler')

const AppError = require('../../utilities/app-error')
const models = require('../../models')
const archiveController = require('../../controllers/archive')
const renderNav = require('../../middleware/render-nav')

// 🔓 Public routes
router.get('/archive/:year?/:month?/:day?', [renderNav], asyncHandler(async (req, res) => {
  try {
    const results = await archiveController(models, { year: req.params.year, month: req.params.month, day: req.params.day })
    res.render('archive/default', results)
  } catch (error) { throw new AppError(404, 'Archive range not found', error.message) }
}))

module.exports = router
