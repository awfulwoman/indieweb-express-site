const debug = require('debug')('indieweb-express-site:routes:syndication:create')
const asyncHandler = require('express-async-handler')
const bodyParser = require('body-parser')
const urlencodedParser = bodyParser.urlencoded({ extended: true })
const is = require('is_js')
const syndication= require('../../../controllers/syndication')
const {checkAuthentication, session} = require('../../../middleware')
// 🏃‍♀️💨 Express
const express = require('express')
const router = express.Router()

// 🔓 Private routes
router.post(`/create`, [checkAuthentication, urlencodedParser], asyncHandler(async (req, res, next) => {
  // An app endpoint which receives a POSTed destination and a key-value pairs of target and source. 
  // It POSTs a webmention to the target with the payload as url-encoded form data.
  // Responds with success or failure
  // No form interface needed

  try {
    debug(req.body)
    
    if (!req.body.modelType) throw new Error('Required parameter missing: modelType')
    if (!req.body.id) throw new Error('Required parameter missing: id')

    // if (is.not.string(req.body.syndicationType)) throw new Error('parameter syndicationType must be a string')
    if (is.not.string(req.body.modelType)) throw new Error('parameter modelType must be a string')
    if (is.not.string(req.body.id)) throw new Error('parameter id must be a string')
  } catch (error) {
    debug(error)
    res.status('400').send({error: error})
    // HTTP 400 seems appropriate here
    // https://softwareengineering.stackexchange.com/a/342896
  }

  try {
    // let results = await dispatch(req.body.destination, {target: req.body.target, source: req.body.source})
    let results = await syndication.create(req.body.modelType, req.body.id)

    debug('Syndication creation route results: ', results)

    if (results.error) throw new Error(results.error)

    res.status(results.httpCode).send(results)

  } catch (error) {
    debug(error)
    res.status('500').send({
      status: 500, 
      error: error
    })
    // HTTP 400 seems appropriate here
    // https://softwareengineering.stackexchange.com/a/342896
  }
}))

module.exports = router
