const debug = require('debug')('sonniesedge:utilities:caching');
const fs = require('fs');
const path = require('path');
const glob = require('glob');
const contentModel = require('../models/content');
const contentController = require('../controllers/content');
const config = require('../config');

const prepNodeCache = function() {

  // Warm up node cache
  glob.sync(`**/index.md`, {cwd: config.contentRoot}).forEach(file => {
    // Retrieve the node from disk, therefore causing it to insert itself into the main node cache.
    let data = contentModel.loadNodeSync(file);

    // If the node has a manual path set, then extract it and add it to the path cache.
    if (data.meta.path) {
      let path = data.meta.path;
      // cache path keys should always end with a slash, for consistency
      if (!path.endsWith('/')) {
        path = path + '/';
      }
      debug('caching - prepcache. Item has path: ', path)
      let cacheSet = contentController.pathCache.set(path, file);
      debug('caching - prepcache. cacheSet: ', cacheSet)
    }
  });

  // Warm up photo cache
  glob.sync(`**/*.jpg`, {cwd: config.contentRoot}).forEach(file => {
    // contentModel.loadNodeFileSync(file); // TODO: uncomment this when we have a working binary file cache
  });

  // Warm up webmentions cache
  glob.sync(`**/webmentions.json`, {cwd: config.contentRoot}).forEach(file => {
    // console.log('file: ', file);
  });

  return contentModel.nodeCache.getStats()
}

const prepNodeListCache = function(amount) {
  config.nodeTypes.forEach(type => {
    // console.log(type.id);
    let result = contentModel.listNodesSync(type.id, amount);
    contentModel.nodeListCache.set(type.id, result);
  });

  // Special for root
  let result = contentModel.listNodesSync('_allnodes', amount);
  contentModel.nodeListCache.set('_allnodes', result);

  return contentModel.nodeListCache.getStats()
}

module.exports = {prepNodeCache, prepNodeListCache}
