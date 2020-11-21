const debug = require('debug')('sonniesedge:controller:disambiguation')
const asyncHandler = require('express-async-handler')

// 🏃‍♀️💨 Express
const express = require('express')
const router = express.Router()
const models = require('../../models')

// 🖕 Middleware
// const {controllerArchiveHelper} = require('../utils')

// 🔓 Public routes 
router.get(`/disambiguation`, asyncHandler(async (req, res, next) => {
  try {
    res.render('content-create/disambiguation-get', {
      data: { title: 'Disambiguation page - GET' }
    })
  } catch (error) {
    debug(error)
  }
}))

router.post(`/disambiguation`, asyncHandler(async (req, res, next) => {
  try {
    
    debug('body: ', req.body)
    debug('params: ', req.params)
    res.render('content-create/disambiguation-post', {
      data: { title: 'Disambiguation page - POST' },
      params: req.params,
      body: req.body
    })
  } catch (error) {
    debug(error)
  }
}))

module.exports = router
