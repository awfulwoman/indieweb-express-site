const debug = require('debug')('sonniesedge:controller:quote')
// 🏃‍♀️💨 Express
const express = require('express')
const router = express.Router()

// 💅 Models
const model = require('../../models/types/quote.model')
const page = require('../../models/types/page.model')
const renderNav = require('../../middleware/render-nav')

// 🖕 Middleware
const {controllerFileHelper, controllerContentHelper, controllerFeedHelper} = require('../utils')
const checkAuthentication = require('../../middleware/check-authentication')

// 🔐 Protected routes 
router.get(`/${model.modelDir}/create`, [renderNav], controllerContentHelper.createGet(model))
router.post(`/${model.modelDir}/create`, [renderNav], controllerContentHelper.createPost(model))
router.get(`/${model.modelDir}/:id/edit`, [renderNav], controllerContentHelper.updateGet(model))
router.post(`/${model.modelDir}/:id/edit`, [renderNav], controllerContentHelper.updatePost(model))
router.get(`/${model.modelDir}/:id/delete`, [renderNav], controllerContentHelper.deleteGet(model))
router.post(`/${model.modelDir}/:id/delete`, [renderNav], controllerContentHelper.deletePost(model))

// 🗼 Syndication routes
router.get(`/${model.modelDir}/rss`, controllerFeedHelper.rssGet(model))
router.get(`/${model.modelDir}/json`, controllerFeedHelper.jsonGet(model))
router.get(`/${model.modelDir}/atom`, controllerFeedHelper.atomGet(model))

// 🔓 Public routes 
router.get(`/${model.modelDir}`, controllerContentHelper.readGet(page, {
  id: model.modelDir, 
  index: true, 
  children: model.recentIndex, 
  template: 'index'
}));
router.get(`/${model.modelDir}/:id`, [renderNav], controllerContentHelper.readGet(model))
router.get(`/${model.modelDir}/:id/:file`, [], controllerFileHelper.readGet(model))
router.get(`/${model.modelDir}/:id/:file/:size`, [], controllerFileHelper.readGet(model))

module.exports = router;
