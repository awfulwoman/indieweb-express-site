const debug = require('debug')('sonniesedge:controller:disambiguation')
const asyncHandler = require('express-async-handler')
const renderNav = require('../../middleware/render-nav')
const checkAuthentication = require('../../middleware/check-authentication')

// 🏃‍♀️💨 Express
const express = require('express')
const router = express.Router()
const models = require('../../models')

const bodyParser = require('body-parser')
const urlencodedParser = bodyParser.urlencoded({ extended: true })

// 🖕 Middleware
// const {controllerArchiveHelper} = require('../utils')

// 🔓 Public routes 
router.get(`/disambiguation`, [renderNav, checkAuthentication], asyncHandler(async (req, res, next) => {
  try {
    res.render('content-create/disambiguation-get', {
      data: { title: 'Disambiguation page - GET' }
    })
  } catch (error) {
    debug(error)
  }
}))

router.post(`/disambiguation`, [urlencodedParser, renderNav, checkAuthentication], asyncHandler(async (req, res, next) => {
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
