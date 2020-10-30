const debug = require('debug')('sonniesedge:controller:page')

// 🏃‍♀️💨 Express
const express = require('express')
const router = express.Router()

// 💅 Models
const models = require('../../models')
const model = require('../../models/types/page.model')
const renderNav = require('../../middleware/render-nav')

// 🖕 Middleware
const {controllerFileHelper, controllerContentHelper, controllerFeedHelper} = require('../utils')

// 🗼 Syndication routes
router.get(`/rss`, controllerFeedHelper.rssGet(models))
router.get(`/json`, controllerFeedHelper.jsonGet(models))
router.get(`/atom`, controllerFeedHelper.atomGet(models))

// 🔓 Public routes 
router.get(`/`, [renderNav], controllerContentHelper.readGet(model, {
  id: 'root',
  index: true, 
  children: models.globalRecentIndex,
  template: 'index'
}))
router.get(`/:id`, [renderNav], controllerContentHelper.readGet(model))
router.get(`/:id/:file`, [], controllerFileHelper.readGet(model))
router.get(`/:id/:file/:size`, [], controllerFileHelper.readGet(model))

module.exports = router;
