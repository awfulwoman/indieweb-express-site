// 🏃‍♀️💨 Express
const express = require('express')
const router = express.Router()

// 💅 Models
const model = require('../models/types/note.model')
const static = require('../models/types/static.model')

// 🖕 Middleware
const file = require('./generics/file')
const markdown = require('./generics/markdown')
const checkAuthentication = require('../middleware/checkauthentication')

// 🔓 Public routes 
router.get(`/${model.modelDir}`, markdown.read(static, {
  id: model.modelDir, 
  index: true, 
  children: model, 
  template: 'index'
}));
router.get(`/${model.modelDir}/:id`, markdown.read(model))
router.get(`/${model.modelDir}/:id/:file`, [], file.read(model))
router.get(`/${model.modelDir}/:id/:file/:size`, [], file.read(model))

// 🔐 Protected routes 
router.get(`/${model.modelDir}/create`, [], markdown.create.get(model))
router.post(`/${model.modelDir}/create`, [], markdown.create.post(model))
router.get(`/${model.modelDir}/:id/edit`, [], markdown.update.get(model))
router.post(`/${model.modelDir}/:id/edit`, [], markdown.update.post(model))
router.get(`/${model.modelDir}/:id/delete`, [], markdown.delete.get(model))
router.post(`/${model.modelDir}/:id/delete`, [], markdown.delete.post(model))

module.exports = router;
