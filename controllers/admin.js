const debug = require('debug')('sonniesedge:controller:admin');
const msg = require('debug')('sonniesedge:messages');
const error = require('debug')('sonniesedge:error');
const randtoken = require('rand-token').generator({
  chars: '0-9'
});

const getNodeTypeScaffold = require('../utilities/getnodetypescaffold');
const config = require('../config');
const { validationResult, matchedData } = require('express-validator');
const contentModel = require('../models/content');

// Admin index
exports.getAdminHome = function(req, res, next) {
  // Receive the type of node to be created
  // console.log("my object: %o", config.nodeTypes);

  res.render('admin/index', {
    admin: true,
    title: 'Admin index'
  });

  // Send back an appropriate form

}


// Create a new node of any type
exports.showNodeIndex = function(req, res, next) {
  // Receive the type of node to be created
  // console.log(`admin - createNode - nodetype ${req.params.nodetype}: `, getNodeTypeScaffold(req.params.nodetype))

  res.render('admin/nodetypeindex', {
    admin: true,
    scaffold: getNodeTypeScaffold(req.params.nodetype),
  });

  // Send back an appropriate form

}



// Edit a node of any type
exports.editNode = function(req, res, next) {
  // Receive the keyPath for that node (as part of URL)

  // Load node formData from model.loadNodeSync (do not use caching)

  // Send back an appropriate form with the fields prefilled
}


// Create a new node of any type
exports.createNode = function(req, res, next) {
  let scaffoldData = getNodeTypeScaffold(req.params.nodetype);
  // console.log('%o', scaffoldData);

  res.render('admin/create', {
    admin: true,
    scaffold: scaffoldData,
  });
}


// Receive and save a node of any type
// POST
exports.submitNode = function(req, res, next) {
  let scaffoldData = {...getNodeTypeScaffold(req.body.type)};

  try {
    for (const item of scaffoldData.fields) {
      item.savedFieldValue = req.body[item.fieldId]
    }

    // Errors?
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      throw errors;
    }

    const data = matchedData(req);

    config.globalFields.forEach(field => {
      if (!data[field.fieldId]) {
        data[field.fieldId] = `${field.fieldDefaultValueGenerator}${data.nodePublic === false ? '-'+randtoken.generate(6) : null}`;
      }
    });

    debug('Sanitized and verified data, with optionals:', data);


    // Separate out content from meta, as required by save model
    let content = data.content;
    delete data.content;

    // SAVE DATA
    contentModel.saveNodeSync(`${data.type}/${data.slug}`, data, content || '');
    contentModel.loadNodeSync(`${data.type}/${data.slug}`); // TODO: UPDATE THE CACHES PROPERLY, inc listings

    // SHOW CONFIRMATION PAGE
    res.render('admin/create', {
      admin: true,
      content: `Your new ${scaffoldData.englishSingular} has been created!`,
      url: `/${data.type}/${data.slug}/`
      // scaffold: scaffoldData
    });

  } catch (errors) {
    error('submitNode errors thrown: ', errors);

    if (Array.isArray(errors)) {
      for (const item of scaffoldData.fields) {
        let uhoh = errors.array().filter(error => error.param === item.fieldId);
        if (uhoh.length > 0) {
          item.errorMessages = []
          for (const oops of uhoh) {
           item.errorMessages.push(oops.msg);
          }
        }
      }
    }

    res.render(`admin/create`, {
      admin: true,
      content: `Looks like there were some errors. 😭`,
      scaffold: scaffoldData
    });

  }
}





// Save a node of any type.
// This endpoint expects a JS object
// Used to perform saves directly from the client instead of via form
exports.saveNodeApi = function(req, res, next) {
  // Receive an object containing content and meta information.

  // Validate the formData using a separate function

  // If not valid return a 400 status code and appropriate error message

  // If valid call model.saveNodeSync and return a 200 status code
}

// Delete a node of any type
exports.deleteNode = function(req, res, next) {
  // Receive the keyPath for that node (as part of URL)
  // Send back a form asking if the user is 100% sure
  // User resubmits form, but with a "yes_i_am_sure" field set to true
  // Send back to route for listing all nodes, with message.

}
