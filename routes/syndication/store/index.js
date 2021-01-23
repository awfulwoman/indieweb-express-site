const debug = require('debug')('indieweb-express-site:routes:syndication:store')
const asyncHandler = require('express-async-handler')
const bodyParser = require('body-parser')
const urlencodedParser = bodyParser.urlencoded({ extended: true })
const is = require('is_js')

const storeSyndication = require('../../../controllers/syndication/store')

// 🏃‍♀️💨 Express
const express = require('express')
const router = express.Router()

// 🔓 Private routes
router.post(`/store`, [urlencodedParser], asyncHandler(async (req, res, next) => {
  try {

    debug(req.body.modelType)
    debug(req.body.id)
    debug(req.body.syndicationUrl)

    if (!req.body.modelType) throw new Error('Required parameter missing: modelType')
    if (!req.body.id) throw new Error('Required parameter missing: id')
    if (!req.body.syndicationUrl) throw new Error('Required parameter missing: syndicationUrl')
    if (is.not.string(req.body.modelType)) throw new Error('parameter modelType must be a string')
    if (is.not.string(req.body.id)) throw new Error('parameter id must be a string')
    if (is.not.url(req.body.syndicationUrl)) throw new Error('parameter syndicationUrl must be a url')
  } catch (error) {
    debug(error)
    res.status('400').send({
      statusCode: 'ERROR',
      statusMessage: 'Parameter error',
      rawResponse: error
    })
    // HTTP 400 seems appropriate here
    // https://softwareengineering.stackexchange.com/a/342896
  }

  try {
    let results = await storeSyndication(req.body.modelType, req.body.id, req.body.syndicationUrl)

    debug('Syndication store route results: %o', results)

    switch (results.statusCode) {
      case 'ERROR':
        // Send error directly
        res.status('500').send(results)
        break
      case 'SUCCESS':
        // Send success directly
        res.status(201).send(results)
        break
      default:
        // Just in case
        res.status(500).send('An unknown error occurred')
        break
    }


  } catch (error) {
    // debug(error)
    res.status('500').send(error)
  }
}))

module.exports = router
