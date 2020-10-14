const debug = require('debug')('sonniesedge:controller:repost')
// 🏃‍♀️💨 Express
const express = require('express')
const router = express.Router()

// 💅 Models
const model = require('../../models/types/repost.model')
const static = require('../../models/types/static.model')

// 🖕 Middleware
const {fileBase, markdownBase} = require('../base')
const checkAuthentication = require('../../middleware/check-authentication')

debug('Controller activated')

// 🔐 Protected routes 
router.get(`/${model.modelDir}/create`, [], markdownBase.createGet(model))
router.post(`/${model.modelDir}/create`, [], markdownBase.createPost(model))
router.get(`/${model.modelDir}/:id/edit`, [], markdownBase.updateGet(model))
router.post(`/${model.modelDir}/:id/edit`, [], markdownBase.updatePost(model))
router.get(`/${model.modelDir}/:id/delete`, [], markdownBase.deleteGet(model))
router.post(`/${model.modelDir}/:id/delete`, [], markdownBase.deletePost(model))

// 🔓 Public routes 
router.get(`/${model.modelDir}`, markdownBase.readGet(static, {
  id: model.modelDir, 
  index: true, 
  children: model.recent, 
  template: 'index'
}));
router.get(`/${model.modelDir}/:id`, markdownBase.readGet(model))
router.get(`/${model.modelDir}/:id/:file`, [], fileBase.read(model))
router.get(`/${model.modelDir}/:id/:file/:size`, [], fileBase.read(model))

module.exports = router;
