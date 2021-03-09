const debug = require('debug')('indieweb-express-site:routes:webmention:send')
const is = require('is_js')

// 🏃‍♀️💨 Express
const express = require('express')
const router = express.Router()
const asyncHandler = require('express-async-handler')

// 🖕 Middleware
const {checkAuthentication} = require('../../../middleware')
// utilities
const dispatch = require('@whalecoiner/webmention-simple-dispatch')

const bodyParser = require('body-parser')
const { body } = require('express-validator')
const urlencodedParser = bodyParser.urlencoded({ extended: true })

// 🔓 Private routes
// router.post(`/send`, [checkAuthentication, urlencodedParser], asyncHandler(async(req, res) => {
router.post('/send', [checkAuthentication, urlencodedParser], asyncHandler(async(req, res) => {
  // An app endpoint which receives a POSTed destination and a key-value pairs of target and source. 
  // It POSTs a webmention to the target with the payload as url-encoded form data.
  // Responds with success or failure
  // No form interface needed

  try {
    debug(req.body)
    if (!req.body.destination) throw new Error('Required parameter missing: destination')
    if (!req.body.target) throw new Error('Required parameter missing: target')
    if (!req.body.source) throw new Error('Required parameter missing: source')

    if (is.not.url(req.body.destination)) throw new Error('parameter destination must be a URL')
    if (is.not.url(req.body.target)) throw new Error('parameter target must be a URL')
    if (is.not.url(req.body.source)) throw new Error('parameter source must be a URL')

    const results = await dispatch(req.body.destination, {target: req.body.target, source: req.body.source})

    res.status(results.status).send(results)
  } catch (error) {
    debug(error)
    res.status('400').send({ error: error.toString() })
    // HTTP 400 seems appropriate here
    // https://softwareengineering.stackexchange.com/a/342896
  }
}))

module.exports = router
