
const debug = require('debug')('sonniesedge:routes:admin');
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const urlencodedParser = bodyParser.urlencoded({ extended: true });
const checkAuthentication = require('../middleware/checkauthentication');
const validateNotes = require('../middleware/validate-notes');
const admin = require('../controllers/admin');

app.enable('strict routing');
const router = express.Router({
    caseSensitive: app.get('case sensitive routing'),
    strict: app.get('strict routing')
});

const middleWare = [checkAuthentication, urlencodedParser];

// !process.env['DEBUG'] ? protected.push(checkAuthentication) : null;

router.get('/', middleWare, admin.getAdminHome); // Needed?
router.get('/:nodetype/', middleWare, admin.showNodeIndex); // Homepage for each node type
// router.post('/admin/:nodetype/:id/, protected, admin.showNode);
// router.post('/admin/:nodetype/:id/delete/', protected, admin.deleteNode); // Provides a confirmatory form to submit. Same Route used post-confirm.
// router.get('/admin/:nodetype/:id/edit/', protected, admin.editNode); // Provides an appropriate form for this ID, prefilled.
router.get('/:nodetype/create/', middleWare, admin.createNode); // Provides a blank form.

router.post('/notes/create/', [middleWare, validateNotes], admin.submitNode); // NOTES, yo
// router.post('/bookmarks/create/', [checkAuthentication, urlencodedParser, validateNotes], admin.submitNode);
// router.post('/replies/create/', [checkAuthentication, urlencodedParser, validateNotes], admin.submitNode);
// router.post('/checkins/create/', [checkAuthentication, urlencodedParser, validateNotes], admin.submitNode);
// router.post('/quotes/create/', [checkAuthentication, urlencodedParser, validateNotes], admin.submitNode);
// router.post('/likes/create/', [checkAuthentication, urlencodedParser, validateNotes], admin.submitNode);
// router.post('/posts/create/', [checkAuthentication, urlencodedParser, validateNotes], admin.submitNode);
// router.post('/reposts/create/', [checkAuthentication, urlencodedParser, validateNotes], admin.submitNode);

router.post('/:nodetype/create/', middleWare, admin.submitNode);

// Expects form data. Provides form and error messages if not as needed.
// router.get('/admin/api/save/', protected, admin.saveNodeApi); // Expects a JS object.

module.exports = router;
