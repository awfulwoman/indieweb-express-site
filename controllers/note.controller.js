const debug = require('debug')('sonniesedge:controller:note')
// 🏃‍♀️💨 Express
const express = require('express')
const router = express.Router()

// 💅 Models
const note = require('../models/note.model')
const static = require('../models/static.model')

// 🖕 Middleware
const {fileBase, markdownBase} = require('./base')
const checkAuthentication = require('../middleware/check-authentication')
const { resolve } = require('app-root-path')

router.get('/test', async (req, res, next) => {
  let temp = await note.recent()
  res.send(temp)
})

// 🔓 Public routes 
router.get(`/${note.modelDir}`, markdownBase.read(static, {
  id: note.modelDir, 
  index: true, 
  children: note.recent, 
  template: 'index'
}));
router.get(`/${note.modelDir}/:id`, markdownBase.read(note))
router.get(`/${note.modelDir}/:id/:file`, [], fileBase.read(note))
router.get(`/${note.modelDir}/:id/:file/:size`, [], fileBase.read(note))

// 🔐 Protected routes 
router.get(`/${note.modelDir}/create`, [], markdownBase.create.get(note))
router.post(`/${note.modelDir}/create`, [], markdownBase.create.post(note))
router.get(`/${note.modelDir}/:id/edit`, [], markdownBase.update.get(note))
router.post(`/${note.modelDir}/:id/edit`, [], markdownBase.update.post(note))
router.get(`/${note.modelDir}/:id/delete`, [], markdownBase.delete.get(note))
router.post(`/${note.modelDir}/:id/delete`, [], markdownBase.delete.post(note))

module.exports = router;
