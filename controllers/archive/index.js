const debug = require('debug')('sonniesedge:controller:archive')

// 🏃‍♀️💨 Express
const express = require('express')
const router = express.Router()
const models = require('../../models')

// 🖕 Middleware
const {controllerArchiveHelper} = require('../utils')

// 🔓 Public routes 
router.get(`/archive/:year`, controllerArchiveHelper.getYear(models))
router.get(`/archive/:year/:month`, controllerArchiveHelper.getMonth(models))
router.get(`/archive/:year/:month/:day`, controllerArchiveHelper.getDay(models))

  module.exports = router
