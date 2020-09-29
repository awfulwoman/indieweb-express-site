const debug = require('debug')('sonniesedge:controller:content');
const debugRoutes = require('debug')('sonniesedge:controller:content:routes');
const msg = require('debug')('sonniesedge:messages');
const error = require('debug')('sonniesedge:error');
const mime = require('mime-types');
const NodeCache = require('node-cache');
const config = require('../config');

// Initialise cache
let pathCache = new NodeCache();

// Markdown
const MarkdownIt = require('markdown-it');
const md = new MarkdownIt();
const implicitFigures = require('markdown-it-implicit-figures');
// const listNodesSync = require('../utilities/listNodesSync');

// Models
const contentModel = require('../models/content');

// Utilities
const constructContentPath = require('../utilities/contentpath');

// CONFIGURATION

// Configure markdown renderer to wrap lone images in <figure> element.
md.use(implicitFigures, {
  dataType: false,  // <figure data-type="image">, default: false
  figcaption: true,  // <figcaption>alternative text</figcaption>, default: false
  tabindex: false, // <figure tabindex="1+n">..., default: false
  link: false // <a href="img.png"><img src="img.png"></a>, default: false
});

// METHODS

// exports.getNode = function(req, res, next) {
//   if (req.params.top === 'locations') {
//     getLocationNode(req, res, next);
//   } else if (req.params.top === 'tags') {
//     getTagNode(req, res, next);
//   } else {
//     getContentNode(req, res, next);
//   }
// }

// Retrieve data for a path and render via template
const getContentNode = function(req, res, next) {
  // Construct path
  let requestedPath = constructContentPath(req.params.top, req.params.id);
  debug('getContentNode - requestedPath: ', requestedPath);
  debugRoutes('requestedPath: ', requestedPath);

  let cachedPath = pathCache.get(requestedPath);

  // debug('getContentNode - cachedpath: ', pathCache);

  // Get node data from appropriate file via cached or direct path name
  let node = contentModel.loadNodeFromCache(cachedPath ? cachedPath : requestedPath);

  debug('getContentNode - path ', requestedPath, ' returned: ', node);

  // Render the data via a template
  if (node && node.meta) {
    debug('getContentNode - received data for: ', requestedPath)
    if (node.meta.index) {
      debug('getContentNode - this is an index node');
      let nodeType = req.params.top || '_allnodes'
      debug('getContentNode - node type is: nodeType');
      let children = contentModel.listNodesFromCache(nodeType);
      
      node.children = children
      // msg('getContentNode - node.children number: ', children)
    }

    if (node.sections) {
      node.sections.forEach(section => {
        section.content = md.render(section.content)
      })
    }

    res.render('page', {
      meta: node.meta,
      children: node.children || null,
      sections: node.sections || null,
      content: md.render(node.content) || null,
      layout: node.meta.layout || 'default'
    });
  } else {
    // error('getContentNode - did not receive viable data for: ', requestedPath)
    next('route');
  }
}

// Retrieve image for a path and return to browser
const getNodeFile = function(req, res, next) {
  debug('getNodeFile - req.params: ', req.params);
  var topPath = req.params.top
  var idPath = req.params.id
  var filePath = req.params.file

  var requestedPath = `${topPath}/${idPath}/files/${filePath}`;
  debug('Storage path: ', requestedPath)
  
  let readStream = contentModel.loadNodeFileSync(requestedPath);

  if (!readStream) {
    error('getNodeFile - no readStream for: ', requestedPath)
    next('route');
  } else {
    readStream.on('open', function () {
      let fileType = mime.lookup(filePath);
      debug('getNodeFile - this looks like a: ', fileType)
      if(fileType){ res.set('Content-Type', fileType) }
      readStream.pipe(res);
    });

    readStream.on('complete', function () {
      debug('Closing readStream');
    })

    readStream.on('error', function(err) {
      error(err);
      res.end(err);
    });
  }
  


}

module.exports = { getContentNode, getNodeFile, pathCache } 
