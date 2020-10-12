const debug = require('debug')('sonniesedge:controller:static')
// 🏃‍♀️💨 Express
const express = require('express')
const router = express.Router()

// 💅 Models
const model = require('../models/static.model')

// 🖕 Middleware
const {fileBase, markdownBase} = require('./base')

debug('Controller activated')

// 🔓 Public routes 

router.get(`/`, [], markdownBase.read(model, {
  id: 'root',
  index: true, 
  // children: model.recent, // TODO: Handle gathering all recent posts
  template: 'index'
}))
router.get(`/:id`, [], markdownBase.read(model))
router.get(`/:id/:file`, [], fileBase.read(model))
router.get(`/:id/:file/:size`, [], fileBase.read(model))

module.exports = router;
