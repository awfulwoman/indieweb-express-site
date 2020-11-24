const debug = require('debug')('sonniesedge:controller:disambiguation')
const asyncHandler = require('express-async-handler')
const renderNav = require('../../middleware/render-nav')
const checkAuthentication = require('../../middleware/check-authentication')
const multer = require('multer')
const upload = multer()

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

    let form_state = {}

    form_state['title'] = req.query ? req.query.title : ''
    form_state['body'] = req.query ? req.query.body : ''
    form_state['url'] = req.query ? req.query.url : ''

    debug('Form state: ', form_state)

    res.render('content-create/disambiguation-get', {
      data: { title: 'Disambiguation page' },
      state: form_state
    })
  } catch (error) {
    debug(error)
  }
}))

router.post(`/disambiguation`, [upload.none(), renderNav, checkAuthentication], asyncHandler(async (req, res, next) => {
  try {

    let form_state = {}

    form_state['title'] = req.query.title || req.body.title || ''
    form_state['body'] = req.query.body || req.body.body || ''
    form_state['url'] = req.query.url || req.body.url || ''

    debug('Form state: ', form_state)

    // debug('body: ', req.body)
    res.render('content-create/disambiguation-post', {
      data: { title: 'Disambiguation page' },
      state: form_state
    })
  } catch (error) {
    debug(error)
  }
}))

module.exports = router
