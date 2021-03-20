// loop through each content page and setup routes

const debug = require('debug')('indieweb-express-site:routes:feeds')
// 🏃‍♀️💨 Express
const express = require('express')
const router = express.Router()
// const { validationResult, matchedData, checkSchema } = require('express-validator')
// const asyncHandler = require('express-async-handler')
const AppError = require('../../utilities/app-error')
// const processFiles = require('../../middleware/process-files')
// const processUploadedFiles = require('../../middleware/process-uploaded-files')
// const md = require('../../utilities/markdown-it')

// 💅 Models
const models = require('../../models')

// 🖕 Middleware
const { feedController } = require('../../controllers')

// 🗼 Syndication routes
router.get(`/rss`, feedController.rssGet(models))
router.get(`/json`, feedController.jsonGet(models))
router.get(`/atom`, feedController.atomGet(models))

module.exports = router
