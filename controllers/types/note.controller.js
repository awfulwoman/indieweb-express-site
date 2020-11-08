const debug = require('debug')('sonniesedge:controller:note')
// 🏃‍♀️💨 Express
const express = require('express')
const router = express.Router()
const { body } = require('express-validator')

// 💅 Models
const model = require('../../models/types/note.model')
const page = require('../../models/types/page.model')
const renderNav = require('../../middleware/render-nav')

// 🖕 Middleware
const {controllerFileHelper, controllerContentHelper, controllerFeedHelper, controllerArchiveHelper} = require('../utils')
const checkAuthentication = require('../../middleware/check-authentication')
const bodyParser = require('body-parser')
const urlencodedParser = bodyParser.urlencoded({ extended: true })

let createValidators = [
  body('content').notEmpty().withMessage(`You need to write some content`),
  body('place.latlng').if(body('place.latlng').notEmpty()).isLatLong()
]

// 🔐 Protected routes 
router.get(`/${model.modelDir}/create`, [renderNav, checkAuthentication], controllerContentHelper.createGet(model))
router.post(`/${model.modelDir}/create`, [renderNav, urlencodedParser, createValidators, checkAuthentication], controllerContentHelper.createPost(model))
router.get(`/${model.modelDir}/:id/edit`, [renderNav, checkAuthentication], controllerContentHelper.updateGet(model))
router.post(`/${model.modelDir}/:id/edit`, [renderNav, urlencodedParser, checkAuthentication], controllerContentHelper.updatePost(model))
router.get(`/${model.modelDir}/:id/delete`, [renderNav, checkAuthentication], controllerContentHelper.deleteGet(model))
router.post(`/${model.modelDir}/:id/delete`, [renderNav, urlencodedParser, checkAuthentication], controllerContentHelper.deletePost(model))

// 🗼 Syndication routes
router.get(`/${model.modelDir}/rss`, controllerFeedHelper.rssGet(model))
router.get(`/${model.modelDir}/json`, controllerFeedHelper.jsonGet(model))
router.get(`/${model.modelDir}/atom`, controllerFeedHelper.atomGet(model))

// 📜 Archives routes
// router.get(`/${model.modelDir}/archive`, controllerArchiveHelper.getOverview(model))
router.get(`/${model.modelDir}/archive/:year`, controllerArchiveHelper(model))
router.get(`/${model.modelDir}/archive/:year/:month`, controllerArchiveHelper(model))
router.get(`/${model.modelDir}/archive/:year/:month/:day`, controllerArchiveHelper(model))

// 🔓 Public routes 
router.get(`/${model.modelDir}`, [renderNav], controllerContentHelper.readGet(page, {
  id: model.modelDir, 
  index: true, 
  children: model.recentIndex, 
  template: 'index'
}));
router.get(`/${model.modelDir}/:id`, [renderNav], controllerContentHelper.readGet(model, {template: 'types/note'}))
router.get(`/${model.modelDir}/:id/:file`, [], controllerFileHelper.readGet(model))
router.get(`/${model.modelDir}/:id/:file/:size`, [], controllerFileHelper.readGet(model))

module.exports = router;
