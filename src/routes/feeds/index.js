const debug = require('debug')('indieweb-express-site:routes:feeds')
// 🏃‍♀️💨 Express
const express = require('express')
const router = express.Router()

// 💅 Models
const models = require('../../models')

// 🖕 Middleware
const { feedController } = require('../../controllers')

// 🗼 Syndication routes
router.get('/rss', feedController.rssGet(models))
router.get('/json', feedController.jsonGet(models))
router.get('/atom', feedController.atomGet(models))

module.exports = router
