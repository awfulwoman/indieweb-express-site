const debug = require('debug')('indieweb-express-site:routes:content:page')

// 🏃‍♀️💨 Express
const express = require('express')
const router = express.Router()
const asyncHandler = require('express-async-handler')
const AppError = require('../../utilities/app-error')

// 💅 Models
const { page } = require('../../models')

// 🖕 Middleware
const { fileController, contentController } = require('../../controllers')

// 📍 Children
router.get('/:id', [], asyncHandler(async (req, res) => {
  try {
    const results = await contentController.readGet(page, { id: req.params.id })
    debug(results)
    res.render(`content-public/types/${page.id}`, results)
  } catch (error) { throw new AppError(404, null, error) }
}))

// 📎 Attached files
router.get('/:id/f/:file', [], fileController.readGet(page))
router.get('/:id/f/:file/:size', [], fileController.readGet(page))

module.exports = router
