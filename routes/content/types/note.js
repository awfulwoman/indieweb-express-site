const debug = require('debug')('sonniesedge:controller:note')
// 🏃‍♀️💨 Express
const express = require('express')
const router = express.Router()
const { body } = require('express-validator')

// 💅 Models
const model = require('../../../models/types/note.model')
const page = require('../../../models/types/page.model')
const renderNav = require('../../../middleware/render-nav')

// 🖕 Middleware
const {fileController, contentController, feedController, archiveController} = require('../../../controllers')
const checkAuthentication = require('../../../middleware/check-authentication')
const bodyParser = require('body-parser')
const urlencodedParser = bodyParser.urlencoded({ extended: true })
const multer = require('multer')
const multerMemoryStorage = multer.memoryStorage()
const processUploadedFiles = multer({ storage: multerMemoryStorage })

const createValidators = require('../../../controllers/validators')
const createSanitizers = require('../../../controllers/sanitizers')
const localValidators = [
  body('content').notEmpty().withMessage(`You need to write some content`)
]
createValidators.push(...localValidators)

// 🔐 Protected routes 
router.get(`/${model.modelDir}/create`, [renderNav, checkAuthentication], contentController.createGet(model))
router.post(`/${model.modelDir}/create`, [renderNav, processUploadedFiles.any(), urlencodedParser, checkAuthentication, createValidators, createSanitizers], contentController.createPost(model))
router.get(`/${model.modelDir}/:id/edit`, [renderNav, checkAuthentication], contentController.updateGet(model))
router.post(`/${model.modelDir}/:id/edit`, [renderNav, processUploadedFiles.any(), urlencodedParser, checkAuthentication, createValidators, createSanitizers], contentController.updatePost(model))
// router.get(`/${model.modelDir}/:id/delete`, [renderNav, checkAuthentication], contentController.deleteGet(model))
// router.post(`/${model.modelDir}/:id/delete`, [renderNav, urlencodedParser, checkAuthentication], contentController.deletePost(model))

// 🗼 Syndication routes
router.get(`/${model.modelDir}/rss`, feedController.rssGet(model))
router.get(`/${model.modelDir}/json`, feedController.jsonGet(model))
router.get(`/${model.modelDir}/atom`, feedController.atomGet(model))

// 📜 Archives routes
// router.get(`/${model.modelDir}/archive`, archiveController.getOverview(model))
router.get(`/${model.modelDir}/archive/:year`, archiveController(model))
router.get(`/${model.modelDir}/archive/:year/:month`, archiveController(model))
router.get(`/${model.modelDir}/archive/:year/:month/:day`, archiveController(model))

// 🔓 Public routes 
router.get(`/${model.modelDir}`, [renderNav], contentController.readGet(page, {
  id: model.modelDir, 
  index: true, 
  children: model.recentIndex, 
  template: 'content-public/index-notes'
}));
router.get(`/${model.modelDir}/:id`, [renderNav], contentController.readGet(model, {template: 'content-public/types/note'}))
router.get(`/${model.modelDir}/:id/:file`, [], fileController.readGet(model))
router.get(`/${model.modelDir}/:id/:file/:size`, [], fileController.readGet(model))

module.exports = router
