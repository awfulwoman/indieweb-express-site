const debug = require('debug')('indieweb-express-site:routes:archive')

// 🏃‍♀️💨 Express
const express = require('express')
const router = express.Router()
const models = require('../../models')

// 🖕 Middleware
const archiveController = require('../../controllers/archive')

// 🔓 Public routes 
router.get(`/archive/:year`, archiveController(models))
router.get(`/archive/:year/:month`, archiveController(models))
router.get(`/archive/:year/:month/:day`, archiveController(models))

module.exports = router
