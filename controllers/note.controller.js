const note = require('../models/types/note.model');
const { body, validationResult } = require('express-validator');
const is = require('is_js');
const authentication = {}

const validateNote = [
  body('content').isAlphanumeric().trim(),
  body('images')
]


app.get('/notes/:id', async (req, res, next) => {

  if(is.falsy(req.params.id))
    next()
  
  try {
    let data = note.read(req.params.id);  

    await res.render('note', {
      content: `Start creating your note!`,
      fields: note.fields
    });
  } catch (error) {
    next()
  }
});

app.get('/notes/create', [authentication], (req, res, next) => {
  res.render('create/note', {
    content: `Start creating your note!`,
    fields: note.fields
  });
});

app.post('/notes/create', [authentication, validateNote], (req, res, next) => {

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
});

app.get('/notes/:id/edit', [authentication], (req, res, next) => {

});

app.post('/notes/:id/edit', [authentication], (req, res, next) => {

});

app.get('/notes/:id/delete', [authentication], (req, res, next) => {

});

app.post('/notes/:id/delete', [authentication], (req, res, next) => {

});
