// 🏃‍♀️💨 Express
const express = require('express')
const router = express.Router()

// 💅 Models
const model = require('../models/note.model')
const static = require('../models/static.model')

// 🖕 Middleware
const {fileBase, markdownBase} = require('./base')
const checkAuthentication = require('../middleware/check-authentication')

// 🔓 Public routes 
router.get(`/${model.modelDir}`, markdownBase.read(static, {
  id: model.modelDir, 
  index: true, 
  children: model, 
  template: 'index'
}));
router.get(`/${model.modelDir}/:id`, markdownBase.read(model))
router.get(`/${model.modelDir}/:id/:file`, [], fileBase.read(model))
router.get(`/${model.modelDir}/:id/:file/:size`, [], fileBase.read(model))

// 🔐 Protected routes 
router.get(`/${model.modelDir}/create`, [], markdownBase.create.get(model))
router.post(`/${model.modelDir}/create`, [], markdownBase.create.post(model))
router.get(`/${model.modelDir}/:id/edit`, [], markdownBase.update.get(model))
router.post(`/${model.modelDir}/:id/edit`, [], markdownBase.update.post(model))
router.get(`/${model.modelDir}/:id/delete`, [], markdownBase.delete.get(model))
router.post(`/${model.modelDir}/:id/delete`, [], markdownBase.delete.post(model))

module.exports = router;
