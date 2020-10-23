const debug = require('debug')('sonniesedge:controller:static')

// 🏃‍♀️💨 Express
const express = require('express')
const router = express.Router()

// 💅 Models
const models = require('../../models')
const model = require('../../models/types/static.model')

// 🖕 Middleware
const {controllerFileHelper, controllerContentHelper, controllerFeedHelper} = require('../utils')

// 🗼 Syndication routes
router.get(`/rss`, controllerFeedHelper.rssGet(models))
router.get(`/json`, controllerFeedHelper.jsonGet(models))
router.get(`/atom`, controllerFeedHelper.atomGet(models))

// 🔓 Public routes 
router.get(`/`, [], controllerContentHelper.readGet(model, {
  id: 'root',
  index: true, 
  children: models.globalRecentIndex,
  template: 'index'
}))
router.get(`/:id`, [], controllerContentHelper.readGet(model))
router.get(`/:id/:file`, [], controllerFileHelper.readGet(model))
router.get(`/:id/:file/:size`, [], controllerFileHelper.readGet(model))

module.exports = router;
