const debug = require('debug')('sonniesedge:controller:disambiguation')
const asyncHandler = require('express-async-handler')
const renderNav = require('../../middleware/render-nav')
const checkAuthentication = require('../../middleware/check-authentication')
const multer = require('multer')
const upload = multer()
const tall = require('tall').tall

// 🏃‍♀️💨 Express
const express = require('express')
const router = express.Router()
const models = require('../../models')

// 🔓 Public routes 
router.get(`/disambiguation`, [checkAuthentication], asyncHandler(async (req, res, next) => {
  try {

    let form_state = {}

    form_state['title'] = req.query ? req.query.title : ''
    form_state['text'] = req.query ? req.query.text : ''
    form_state['url'] = req.query ? req.query.url : ''

    res.render(req.query.title || req.query.text || req.query.url ? 'content-create/disambiguation-post' : 'content-create/disambiguation-get', {
      data: { title: 'Disambiguation' },
      state: form_state
    })
  } catch (error) {
    debug(error)
  }
}))

router.post(`/disambiguation`, [upload.none(), checkAuthentication], asyncHandler(async (req, res, next) => {
  try {

    console.log('req.query: ', req.query)
    console.log('req.body: ', req.body)

    let form_state = {}

    form_state['title'] = req.query && req.query.title ? req.query.title : req.body.title || ''
    form_state['text'] = req.query && req.query.text ? req.query.text : req.body.text || ''
    form_state['url'] = req.query && req.query.url ? req.query.url : req.body.url || ''

    // Unshorten any shortened URLs
    form_state['url'] = await tall(form_state['url'])
    
    res.render('content-create/disambiguation-post', {
      data: { title: 'Disambiguation' },
      state: form_state
    })
  } catch (error) {
    debug(error)
  }
}))

module.exports = router
