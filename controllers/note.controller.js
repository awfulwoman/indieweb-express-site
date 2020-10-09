const express = require('express')
const app = express();

// TODO: Can I just remove this or move to app.js?
app.enable('strict routing');
const router = express.Router({
    caseSensitive: app.get('case sensitive routing'),
    strict: app.get('strict routing')
});

// Models
const note = require('../models/types/note.model')
const static = require('../models/types/static.model')

// Middleware
const asyncHandler = require('express-async-handler');
const file = require('./generics/file')
const markdown = require('./generics/markdown')
const checkAuthentication = require('../middleware/checkauthentication')

// 🔓 Public routes 
router.get('/notes/', markdown.read(static, {id: 'notes', index: true, children: note, template: 'index'}));
router.get('/notes/:id/', markdown.read(note));
router.get('/notes/:id/:file', [], file.read(note));
router.get('/notes/:id/:file/:size', [], file.read(note));

// 🔐 Protected routes 
router.get('/notes/create/', [], markdown.create.get(note));
router.post('/notes/create/', [], markdown.create.post(note));
router.get('/notes/:id/edit/', [], markdown.update.get(note));
router.post('/notes/:id/edit/', [], markdown.update.post(note));
router.get('/notes/:id/delete/', [], markdown.delete.get(note));
router.post('/notes/:id/delete/', [], markdown.delete.post(note));

module.exports = router;
