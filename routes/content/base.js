const debug = require('debug')('sonniesedge:controller:base')

// 🏃‍♀️💨 Express
const express = require('express')
const router = express.Router()

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
router.get(`/`, [renderNav], contentController.readGet(models.page, {
  id: 'root',
  index: true, 
  children: models.globalRecentIndex,
  template: 'homepage'
}))
router.get(`/:id`, [renderNav], contentController.readGet(models.page, {template: 'content-public/types/page'}))
router.get(`/:id/:file`, [], fileController.readGet(models.page))
router.get(`/:id/:file/:size`, [], fileController.readGet(models.page))

module.exports = router;
