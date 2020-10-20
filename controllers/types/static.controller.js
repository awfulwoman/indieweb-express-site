const debug = require('debug')('sonniesedge:controller:static')

// 🏃‍♀️💨 Express
const express = require('express')
const router = express.Router()

// 💅 Models
const models = require('../../models')
const model = require('../../models/types/static.model')

// 🖕 Middleware
const {controllerFileHelper, controllerContentHelper} = require('../utils')



// 🔓 Public routes 

router.get(`/`, [], controllerContentHelper.readGet(model, {
  id: 'root',
  index: true, 
  children: models.recent,
  template: 'index'
}))
router.get(`/:id`, [], controllerContentHelper.readGet(model))
router.get(`/:id/:file`, [], controllerFileHelper.readGet(model))
router.get(`/:id/:file/:size`, [], controllerFileHelper.readGet(model))

module.exports = router;
