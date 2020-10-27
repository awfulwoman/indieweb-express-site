const debug = require('debug')('sonniesedge:controller:note')
// 🏃‍♀️💨 Express
const express = require('express')
const router = express.Router()

// 💅 Models
const model = require('../../models/types/note.model')
const static = require('../../models/types/static.model')

// 🖕 Middleware
const {controllerFileHelper, controllerContentHelper, controllerFeedHelper, controllerArchiveHelper} = require('../utils')
const checkAuthentication = require('../../middleware/check-authentication')

// 🔐 Protected routes 
router.get(`/${model.modelDir}/create`, [], controllerContentHelper.createGet(model))
router.post(`/${model.modelDir}/create`, [], controllerContentHelper.createPost(model))
router.get(`/${model.modelDir}/:id/edit`, [], controllerContentHelper.updateGet(model))
router.post(`/${model.modelDir}/:id/edit`, [], controllerContentHelper.updatePost(model))
router.get(`/${model.modelDir}/:id/delete`, [], controllerContentHelper.deleteGet(model))
router.post(`/${model.modelDir}/:id/delete`, [], controllerContentHelper.deletePost(model))

// 🗼 Syndication routes
router.get(`/${model.modelDir}/rss`, controllerFeedHelper.rssGet(model))
router.get(`/${model.modelDir}/json`, controllerFeedHelper.jsonGet(model))
router.get(`/${model.modelDir}/atom`, controllerFeedHelper.atomGet(model))

// 📜 Archives routes
// router.get(`/${model.modelDir}/archive`, controllerArchiveHelper.getOverview(model))
router.get(`/${model.modelDir}/archive/:year`, controllerArchiveHelper.getYear(model))
router.get(`/${model.modelDir}/archive/:year/:month`, controllerArchiveHelper.getMonth(model))
router.get(`/${model.modelDir}/archive/:year/:month/:day`, controllerArchiveHelper.getDay(model))

// 🔓 Public routes 
router.get(`/${model.modelDir}`, controllerContentHelper.readGet(static, {
  id: model.modelDir, 
  index: true, 
  children: model.recentIndex, 
  template: 'index'
}));
router.get(`/${model.modelDir}/:id`, controllerContentHelper.readGet(model, {template: 'types/note'}))
router.get(`/${model.modelDir}/:id/:file`, [], controllerFileHelper.readGet(model))
router.get(`/${model.modelDir}/:id/:file/:size`, [], controllerFileHelper.readGet(model))

module.exports = router;
