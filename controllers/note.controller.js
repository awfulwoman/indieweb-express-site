const express = require('express');
const app = express();
app.enable('strict routing');
const router = express.Router({
    caseSensitive: app.get('case sensitive routing'),
    strict: app.get('strict routing')
});
const bodyParser = require('body-parser');
const urlencodedParser = bodyParser.urlencoded({ extended: true });
const checkAuthentication = require('../middleware/checkauthentication');

const note = require('../models/types/note.model');
const { body, validationResult } = require('express-validator');
const is = require('is_js');
const asyncHandler = require('express-async-handler');
const { resolve } = require('app-root-path');
const ErrorHandler = require('../utilities/error-handler')

const validateNote = [
  body('content').isAlphanumeric().trim(),
  body('images')
]

// router.get('/notes/', asyncHandler(async (req, res, next) => {

//   let itemObj = await note.read(req.params.id);

//   res.render('page', {
//     content: itemObj.content,
//     meta: itemObj.data,
//   });

// }));

router.get('/error', asyncHandler( async (req, res, next) => {
  throw new ErrorHandler('500', 'Internal server error');
}))

router.get('/notes/:id', asyncHandler(async (req, res, next) => {
  try {
    let itemObj = await note.read(req.params.id);

    res.render('page', {
      content: itemObj.content,
      meta: itemObj.data,
    });
  } catch (error) {
    throw new ErrorHandler(404, 'Note not found')
  }
}));

router.get('/notes/create', [], asyncHandler(async (req, res, next) => {
  res.render('create/note', {
    content: `Start creating your note!`,
    fields: note.fields
  });
}));

router.post('/notes/create', [checkAuthentication, urlencodedParser, validateNote], asyncHandler(async (req, res, next) => {

  // Errors?
  const errors = validationResult(req);

  try {

    if (errors && is.not.empty(errors)) {
      throw new Error('Validation errors present');
    }

    // add any missing data
    // ensureDefaultData() ??
    if (is.falsy(req.body.meta.created))
      req.body.meta.created = _global.fields.created.default
    if (is.falsy(req.body.meta.updated))
      req.body.meta.updated = _global.fields.updated.default
    if (is.falsy(req.body.meta.uuid))
      req.body.meta.uuid = _global.fields.uuid.default
    if (is.falsy(req.body.meta.slug))
      req.body.meta.slug = slug || _global.fields.slug.default

    // save
    note.create(meta, content, slug)

    // Render
    res.render('create/note', {
      success: true,
      flash: { type: 'success', message: `Note created` },
      content: `Your new Note has been created!`,
      url: `/notes/${req.body.meta.slug}/`
    });
  } catch (error) {
    res.render('create/note', {
      flash: { type: 'error', message: `Note creation failed`, additional: error.toString() },
      content: `Something went wrong and the note wasn't created. 😭`,
      errors: errors.toArray()
    });
  }
}));

router.get('/notes/:id/edit', [], asyncHandler(async (req, res, next) => {

}));

router.post('/notes/:id/edit', [], asyncHandler(async (req, res, next) => {

}));

router.get('/notes/:id/delete', [], asyncHandler(async (req, res, next) => {

}));

router.post('/notes/:id/delete', [], asyncHandler(async (req, res, next) => {

}));


router.get('/notes/:id/:file', [], asyncHandler(async (req, res, next) => {
  // check that note id is valid

  // redirect to a default size


}));

router.get('/notes/:id/:file/:size', [], asyncHandler(async (req, res, next) => {
  // check that note id is valid

  // try to get file


}));

module.exports = router;
