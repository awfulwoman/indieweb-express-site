const debug = require('debug')('sonniesedge:controller:checkin')
// 🏃‍♀️💨 Express
const express = require('express')
const router = express.Router()
const { body } = require('express-validator')

// 💅 Models
const model = require('../../models/types/checkin.model')
const page = require('../../models/types/page.model')
const renderNav = require('../../middleware/render-nav')

// 🖕 Middleware
const {fileController, contentController, feedController} = require('../../controllers')
const checkAuthentication = require('../../middleware/check-authentication')

const bodyParser = require('body-parser')
const urlencodedParser = bodyParser.urlencoded({ extended: true })

const createValidators = require('../../controllers/validators')
const createSanitizers = require('../../controllers/sanitizers')

// 🔐 Protected routes 
router.get(`/${model.modelDir}/create`, [renderNav, checkAuthentication], contentController.createGet(model))
router.post(`/${model.modelDir}/create`, [renderNav, urlencodedParser, checkAuthentication, createValidators, createSanitizers], contentController.createPost(model))
router.get(`/${model.modelDir}/:id/edit`, [renderNav, checkAuthentication], contentController.updateGet(model))
router.post(`/${model.modelDir}/:id/edit`, [renderNav, urlencodedParser, checkAuthentication, createValidators, createSanitizers], contentController.updatePost(model))
// router.get(`/${model.modelDir}/:id/delete`, [renderNav, checkAuthentication], contentController.deleteGet(model))
// router.post(`/${model.modelDir}/:id/delete`, [renderNav, urlencodedParser, checkAuthentication], contentController.deletePost(model))


// 🗼 Syndication routes
router.get(`/${model.modelDir}/rss`, feedController.rssGet(model))
router.get(`/${model.modelDir}/json`, feedController.jsonGet(model))
router.get(`/${model.modelDir}/atom`, feedController.atomGet(model))

// 🔓 Public routes 
router.get(`/${model.modelDir}`, [renderNav], contentController.readGet(page, {
  id: model.modelDir, 
  index: true, 
  children: model.recentIndex, 
  template: 'content-public/index'
}));
router.get(`/${model.modelDir}/:id`, [renderNav], contentController.readGet(model, {template: `content-public/types/${model.id}`}))
router.get(`/${model.modelDir}/:id/:file`, [], fileController.readGet(model))
router.get(`/${model.modelDir}/:id/:file/:size`, [], fileController.readGet(model))

module.exports = router;
