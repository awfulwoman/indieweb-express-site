const debug = require('debug')('sonniesedge:routes:webmention:send')

// 🏃‍♀️💨 Express
const express = require('express')
const router = express.Router()
const asyncHandler = require('express-async-handler')

// 🖕 Middleware
const checkAuthentication = require('../../../middleware/check-authentication')

// utilities
const dispatchWebmention = require('../../../controllers/webmentions/send/dispatch')

const bodyParser = require('body-parser')
const { body } = require('express-validator')
const urlencodedParser = bodyParser.urlencoded({ extended: true })

// 🔓 Private routes 
router.post(`/send`, [checkAuthentication, urlencodedParser], asyncHandler(async(req, res) => {

  // An app endpoint which receives a POSTed destination and a key-value pairs of target and source. 
  // It POSTs a webmention to the target with the payload as url-encoded form data.
  // Responds with success or failure
  // No form interface needed

  try {
    if (!req.body.destination) throw new Error('Required parameter missing: destination')
    if (!req.body.target) throw new Error('Required parameter missing: target')
    if (!req.body.source) throw new Error('Required parameter missing: source')
    
    let results = await dispatchWebmention(req.body.destination, {target: req.body.target, source: req.body.source})

    res.status(200).send(results)
  } catch (error) {
    debug(error)
    res.status('400').send(error)
    // HTTP 400 seems appropriate here
    // https://softwareengineering.stackexchange.com/a/342896
  }

  
  
}))

router.get(`/offline`, asyncHandler(async (req, res, next) => {
  try {
    res.render('default', {
      data: { title: 'Du bist Offline' },
      content: md.render("Looks like you're offline."),
    })
  } catch (error) {
    debug(error)
  }
}))

module.exports = router
