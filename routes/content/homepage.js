// loop through each content page and setup routes

const debug = require('debug')('indieweb-express-site:routes:homepage')
// 🏃‍♀️💨 Express
const express = require('express')
const router = express.Router()
const asyncHandler = require('express-async-handler')
const AppError = require('../../utilities/app-error')

// 💅 Models
const { globalRecentIndex, page } = require('../../models')

// 🖕 Middleware
const { fileController, contentController } = require('../../controllers')

router.get('/', [], asyncHandler(async (req, res) => {
  try {
    const results = await contentController.readGet(page, { id: req.params.id, children: globalRecentIndex })
    debug(results)
    res.render('homepage', results)
  } catch (error) { throw new AppError(404, null, error) }
}))

// 📎 Attached files
router.get('/f/:file', [], fileController.readGet(page))
router.get('/f/:file/:size', [], fileController.readGet(page))

module.exports = router
