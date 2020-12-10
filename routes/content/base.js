const debug = require('debug')('sonniesedge:controller:base')

// 🏃‍♀️💨 Express
const express = require('express')
const router = express.Router()

// 💅 Models
const models = require('../../models')
const renderNav = require('../../middleware/render-nav')

// 🖕 Middleware
const {controllerFileHelper, controllerContentHelper, controllerFeedHelper} = require('../../controllers')

// 🗼 Syndication routes
router.get(`/rss`, controllerFeedHelper.rssGet(models))
router.get(`/json`, controllerFeedHelper.jsonGet(models))
router.get(`/atom`, controllerFeedHelper.atomGet(models))

// 🔓 Public routes 
router.get(`/`, [renderNav], controllerContentHelper.readGet(models.page, {
  id: 'root',
  index: true, 
  children: models.globalRecentIndex,
  template: 'homepage'
}))
router.get(`/:id`, [renderNav], controllerContentHelper.readGet(models.page, {template: 'content-public/types/page'}))
router.get(`/:id/:file`, [], controllerFileHelper.readGet(models.page))
router.get(`/:id/:file/:size`, [], controllerFileHelper.readGet(models.page))

module.exports = router;
