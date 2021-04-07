// loop through each content page and setup routes

const debug = require('debug')('indieweb-express-site:routes:content:page')
// 🏃‍♀️💨 Express
const express = require('express')
const router = express.Router()
const { validationResult, matchedData, checkSchema } = require('express-validator')
const asyncHandler = require('express-async-handler')
const AppError = require('../../utilities/app-error')
const processFiles = require('../../middleware/process-files')
const processUploadedFiles = require('../../middleware/process-uploaded-files')
const { md } = require('../../utilities')

// 💅 Models
const { page } = require('../../models')

// 🖕 Middleware
const { fileController, contentController, feedController, archiveController } = require('../../controllers')
const { requireAuthentication } = require('../../middleware')

// const bodyParser = require('body-parser')
// const urlencodedParser = bodyParser.urlencoded({ extended: true })

// const createValidators = require('../../../controllers/validators')
// const globalSanitizers = require('../../controllers/sanitizers')


// debug(page.id, page.structure)
// debug('page.fields: ', page.fields)
if (!page.fields || page.fields.length === 0) throw new Error(`${page.id} has no validation fields!`)
const localValidators = {}
if (page.fields) page.fields.forEach(field => Object.assign(localValidators, field.validation))
// debug('localValidators: ', localValidators)
// debug(checkSchema(localValidators))

// -------------------------
// 🔐 Protected admin routes
// -------------------------

// // Create (GET)
// router.get(`/${page.modelDir}/create`, [requireAuthentication], asyncHandler(async (req, res) => {
//     debug(`/${page.modelDir}/create (get)`)
//     try {
//         const results = await contentController.createGet({ page: page, query: req.query })
//         res.render(`content-create/types/${page.id}`, results)
//     } catch (error) { throw new AppError(404, `Could not load /${page.modelDir}/create`, error) }
// }))

// // Create (POST)
// const createPostMiddleware = [requireAuthentication, processFiles.any(), processUploadedFiles, checkSchema(localValidators)]
// router.post(`/${page.modelDir}/create`, createPostMiddleware, asyncHandler(async (req, res) => {
//     debug(`/${page.modelDir}/create (post)`)
//     try {
//         const results = await contentController.createPost({
//             page: page,
//             sanitizedData: matchedData(req),
//             errors: validationResult(req).errors,
//             body: req.body,
//             files: req.files || null
//         })
//         req.flash('info', results.messages)
//         req.session.save(() => res.redirect(results.url))
//     } catch (error) {
//         error.contentErrors.data = { title: 'Create failed' }
//         error.contentHtml = md.render('Create encountered errors.')
//         res.render(`content-create/types/${page.id}`, error.contentErrors)
//     }
// }))

// // Update (GET)
// router.get(`/${page.modelDir}/:id/edit`, [requireAuthentication], asyncHandler(async (req, res) => {
//     try {
//         const results = await contentController.updateGet(page)
//         res.render(`content-create/types/${page.id}`, results)
//     } catch (error) { throw new AppError(404, `Could not load /${page.modelDir}/edit/${req.params.id}`, error) }
// }))

// // Update (POST)
// router.post(`/${page.modelDir}/:id/edit`, [requireAuthentication, processFiles.any(), processUploadedFiles, checkSchema(localValidators)], asyncHandler(async (req, res) => {
//     try {
//         const results = await contentController.updatePost(page)
//         res.render(`content-create/types/${page.id}`, results)
//     } catch (error) { throw new AppError(404, `Could not load /${page.modelDir}/edit/${req.params.id}`, error) }
// }))

// router.get(`/${page.modelDir}/:id/delete`, [requireAuthentication], asyncHandler(async (req, res) => {
//   try {
//     const results = await contentController.deleteGet(page)
//     res.render(`content-create/types/${page.id}`, results)
//   } catch (error) { throw new AppError(404, `Could not load /${page.modelDir}/delete/${req.params.id}`, error) }
// }))

// router.post(`/${page.modelDir}/:id/delete`, [urlencodedParser, requireAuthentication, createValidators, localValidators, globalSanitizers], asyncHandler(async (req, res) => {
//   try {
//     const results = await contentController.deletePost(page)
//     res.render(`content-create/types/${page.id}`, results)
//   } catch (error) { throw new AppError(404, `Could not load /${page.modelDir}/delete/${req.params.id}`, error) }
// }))

// ---------------------
// 🔓 Public routes
// ---------------------

// 🗼 Syndication routes
// router.get(`/${page.modelDir}/rss`, feedController.rssGet(page))
// router.get(`/${page.modelDir}/json`, feedController.jsonGet(page))
// router.get(`/${page.modelDir}/atom`, feedController.atomGet(page))

// // 📜 Archives routes
// router.get(`/${page.modelDir}/archive/:year?/:month?/:day?`, [], asyncHandler(async (req, res) => {
//     try {
//         const results = await archiveController(page, { year: req.params.year, month: req.params.month, day: req.params.day })
//         res.render('archive/default', results)
//     } catch (error) { throw new AppError(404, '', error) }
// }))

// // 📌 Index
// router.get(`/${page.modelDir}`, [], asyncHandler(async (req, res) => {
//     try {
//         const results = await contentController.readGet(page, { id: page.modelDir, children: page.recentIndex })
//         res.render('content-public/index', results)
//     } catch (error) { throw new AppError(404, null, error) }
// }))

// 📍 Children
router.get('/:id', [], asyncHandler(async (req, res) => {
    try {
        const results = await contentController.readGet(page, { id: req.params.id })
        // results.log = req.flash('info') || null
        res.render(`content-public/types/${page.id}`, results)
    } catch (error) { throw new AppError(404, null, error) }
}))

// 📎 Attached files
router.get(`/:id/f/:file`, [], fileController.readGet(page))
router.get(`/:id/f/:file/:size`, [], fileController.readGet(page))


module.exports = router
