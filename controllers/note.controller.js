const note = require('../models/types/note.model');
const { body, validationResult } = require('express-validator');
const authentication = {}

const validateNote = [

]

const middlewareChain = [authentication]

app.get('/notes/create', [middlewareChain], (req, res, next) => {
  res.render('create/note', {
    content: `Start creating your note!`,
    fields: note.fields
  });
});

app.post('/notes/create', [middlewareChain, validateNote], (req, res, next) => {
  try {

    // add any missing data
    if (is.falsy(req.body.meta.created))
      req.body.meta.created = _global.fields.created.default
    if (is.falsy(req.body.meta.updated))
      req.body.meta.updated = _global.fields.updated.default
    if (is.falsy(req.body.meta.uuid))
      req.body.meta.uuid = _global.fields.uuid.default
    if (is.falsy(req.body.meta.slug))
      req.body.meta.slug = slug || _global.fields.slug.default

    // save
    await note.save(meta, content, slug)

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
      content: `Something went wrong and the note wasn't created. 😭`
    });
  }
});

app.get('/notes/:id/edit', [middlewareChain], (req, res, next) => {

});

app.post('/notes/:id/edit', [middlewareChain], (req, res, next) => {

});

app.get('/notes/:id/delete', [middlewareChain], (req, res, next) => {

});

app.post('/notes/:id/delete', [middlewareChain], (req, res, next) => {

});
