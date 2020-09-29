
const debug = require('debug')('sonniesedge:routes:content');
const express = require('express');
const app = express();
const contentController = require('../controllers/content');
const path = require('path');

app.enable('strict routing');
const router = express.Router({
    caseSensitive: app.get('case sensitive routing'),
    strict: app.get('strict routing')
});

// STATIC FILES
router.use("/public", express.static(path.join(__dirname, '../public'), {fallthrough: false}));

// BAD LOGIN
router.get('/youdidntsaythemagicword', function(req, res, next) {
    res.render('youdidntsaythemagicword', { 

    });
})

// HOME
router.get('/', contentController.getContentNode);

// DATA
router.get('/:top/', contentController.getContentNode);
router.get('/:top/:id/', contentController.getContentNode);
router.get('/:top/:id/:file', contentController.getNodeFile);

module.exports = router;
