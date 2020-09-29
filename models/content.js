const debug = require('debug')('sonniesedge:model:content');
const msg = require('debug')('sonniesedge:messages');
const error = require('debug')('sonniesedge:error');
const NodeCache = require('node-cache');
const matter = require('gray-matter');
const fs = require('fs');
const config = require('../config');
const YAML = require('js-yaml');
const outdent = require('outdent');
const path = require('path');
const glob = require('glob');
const normalize = require('normalize-path');
const excerpt = require('../utilities/excerpt');

// Initialise caches
let nodeCache = new NodeCache();
let nodeListCache = new NodeCache();

// Generate a standardised key for the cache from the provided path
const getKeyFromPath = function (retrievePath) {
  if (!path.isAbsolute(retrievePath)) {
    retrievePath = '/' + retrievePath
  }

  if (!path.extname(retrievePath) === '' && !retrievePath.endsWith('/')) {
    retrievePath = retrievePath + '/'
  }

  if (path.extname(retrievePath) === '') {
    retrievePath = path.join(retrievePath, 'index.md');
  }

  return retrievePath;
}


// Retrieve data from a specific markdown file
// id: '/posts/3145/'
// id: '/'
// id: '/notes/'
// implicitly assumes 'index.md' after the string.
// returns: obj {node meta, node content}
const loadNodeSync = function (retrievePath) {
  // Get the unique key (used for caching)
  let keyPath = getKeyFromPath(retrievePath);

  // Get the node path on disk
  let fileSystemPath = path.join(config.dataRoot, 'content', retrievePath);
  fileSystemPath = normalize(fileSystemPath);

  // Get the node path on disk, including markdown file if it isn't present in path
  let fileSystemPathWithFile = fileSystemPath
  if (!fileSystemPathWithFile.endsWith('.md') && !fileSystemPathWithFile.endsWith('/')) {
    fileSystemPathWithFile = fileSystemPathWithFile + '/';
  }
  if (!fileSystemPathWithFile.endsWith('.md')) {
    fileSystemPathWithFile = path.join(fileSystemPathWithFile, 'index.md');
  }

  // Confirm that the file exists
  let fileExists = fs.existsSync(fileSystemPathWithFile);

  if (fileExists) {
    debug('loadNodeSync - file exists on disk: ', retrievePath)
    let fileRaw = fs.readFileSync(fileSystemPathWithFile, 'utf8');
    let fileObj = matter(fileRaw, {});

    if (fileObj) {
      // Data is a horrible property name. change it to meta.
      fileObj.meta = fileObj.data;
      delete fileObj.data;

      // debug('loadNodeSync - meta: ', fileObj.meta);

      // Remove orig
      delete fileObj.orig;
      // delete fileObj.excerpt;
      delete fileObj.isEmpty;

      if (fileObj.content && !fileObj.excerpt) {
        excerpt(fileObj.content) ? fileObj.meta.excerpt = excerpt(fileObj.content) : null;
      }

      // Add a unique keyed path
      // debug('loadNodeSync - fileObj: ', fileObj);
      fileObj.meta.keyPath = keyPath;

      if (fileObj.meta.sections) {
        debug('loadNodeSync - list of attached sections: ', fileObj.meta.sections);

        let tempSections = []
        fileObj.meta.sections.forEach(part => {
          let sectionFile = path.join(fileSystemPath, 'sections', part + '.md')

          if (fs.existsSync(sectionFile)) {
            let sectionFileRaw = fs.readFileSync(sectionFile, 'utf8');
            let partMatterObj = matter(sectionFileRaw);
            // debug(partMatter)
            tempSections.push(partMatterObj)
          }
        })

        fileObj.sections = tempSections;
        debug('loadNodeSync - fileObj.sections: ', fileObj.sections)
      }

      let savedCache = nodeCache.set(keyPath, fileObj);

      if (savedCache) {
        debug(`loadNodeSync - saved ${keyPath} to cache: `, fileObj);
        return fileObj

      } else {
        error(`loadNodeSync - Could not save ${keyPath} to cache.`)
        return false;
      }

    } else {
      error('loadNodeSync - unable to get parse any data: ', retrievePath)
      return false
    }

  } else {
    error('loadNodeSync - unable to find Markdown file: ', fileSystemPathWithFile)
    return false
  }

}

const loadNodeFromCache = function (retrievePath) {
  debug('loadNodeFromCache - received parameter value: ', retrievePath);
  let keyPath = getKeyFromPath(retrievePath);
  // let fileSystemPath = path.join(config.dataRoot, 'content', retrievePath);

  let cacheResult = nodeCache.get(keyPath);

  if (cacheResult) {
    // debug('loadNodeFromCache - got from cache: ', cacheResult)
    return cacheResult;
  } else {
    // error(`loadNodeFromCache - could not get ${retrievePath} from cache. Got: `, cacheResult)
    return false;
  }
}

// SAVE NODE
// savePath: string ('/content/', '/posts/1234/')
const saveNodeSync = function (savePath, data, content) {
  // save to markdown file on filesystem. 
  // update cache.
  debug('saveNodeSync called with: ', savePath);

  let fullPath = path.join(config.dataRoot, 'content', savePath);

  data = YAML.safeDump(data)
  let node = outdent`---
      ${data}
      ---

      ${content}
      `

  debug('saveNodeSync - file to save: ', savePath);

  if (!fs.existsSync(fullPath)) {
    fs.mkdirSync(fullPath, { recursive: true });
  } else {
    error('saveNodeSync - fullPath already exists: ', fullPath);
  }

  let truePath = path.join(fullPath, 'index.md');

  try {
    fs.writeFileSync(truePath, node, function (err) {
      if (err) {
        error('saveNodeSync - save error!: ', err)
        return false;
      }
    });
  } catch (catchError) {
    error('saveNodeSync - could not write:', catchError)
  }
  return true;


  // TODO: SAVE TO CACHE once path handling has been normalised.
}

// const deleteNode = function(deletePath) {
//   // delete markdown file
//   // update cache.
// }


const loadNodeFileSync = function (retrievePath) {
  let normalizedPath = normalize(retrievePath);
  if (!normalizedPath.startsWith('/')) {
    normalizedPath = '/' + normalizedPath
  }

  let fileSystemPath = path.join(config.appRoot, 'data', 'content', normalizedPath)

  if (fs.existsSync(fileSystemPath)) {
    debug('loadNodeFileSync - file exists on disk: ', fileSystemPath)
    // TODO: Add to cache
    return fs.createReadStream(fileSystemPath);
  } else {
    error('loadNodeFileSync - unable to find file: ', fileSystemPath)
    return false // was "null"
  }
}

const listNodesSync = function (nodeType, amount=10) {
  debug('listNodesSync - nodeType: ', nodeType);

  let nodeTypeClean = nodeType;
  if(nodeTypeClean === undefined || nodeTypeClean === '' || nodeTypeClean === false || nodeTypeClean === null || nodeTypeClean === '_allnodes') {
    nodeTypeClean = '_allnodes'
  }
  let content
  if (nodeTypeClean ==='_allnodes') {
    content = glob.sync(`*/*/`, { cwd: path.join(config.contentRoot) });
  } else {
    content = glob.sync(`${nodeTypeClean}/*/`, { cwd: path.join(config.contentRoot) });
  }
  
  msg(`Found ${content.length} nodes for nodetype: '${nodeTypeClean}'`);
  let nodeList = [];
  // debug('listNodesSync - raw list: ', content)
  content.forEach(file => {

    let keyPath = getKeyFromPath(file);

    // Retrieve node data
    let nodeData = this.loadNodeFromCache(keyPath);
    debug('NODEDATA: ', nodeData);

    if (!nodeData || nodeData.meta.index || nodeData.meta.publish === false || nodeData.meta.private === true || nodeData.meta.show_in_index === false) {
      // No data, a non-public node, or an index node
      debug('listNodesSync - path ', keyPath, ' is hidden.');
    } else {
      // debug('listNodesSync - path ', file, ' returned: ', nodeData);
      if (nodeData.excerpt) {
        nodeData.meta.excerpt = nodeData.excerpt;
      }
      nodeList.push(nodeData.meta);
    }
  });

  // order by created date
  nodeList.sort(function(a,b){
    // Turn your strings into dates, and then subtract them
    // to get a value that is either negative, positive, or zero.
    return new Date(a.created) - new Date(b.created);
  });

  // truncate to passed amount
  nodeList = nodeList.slice(-Math.abs(amount));

  // TODO: Add to nodeList cache
  let savedCache = nodeListCache.set(nodeTypeClean ? nodeTypeClean : '_allnodes', nodeList);

  if (savedCache) {
    debug(`listNodesSync - saved ${nodeTypeClean} to cache: `, nodeList);
    return nodeList

  } else {
    error(`listNodesSync - Could not save ${nodeTypeClean} to cache.`)
    return false;
  }


  // return nodeList;
}

const listNodesFromCache = function(nodeType) {
  debug('listNodesFromCache - received parameter value: ', nodeType);
  // let fileSystemPath = path.join(config.dataRoot, 'content', retrievePath);

  if (nodeType === undefined || nodeType === null || nodeType === ''|| nodeType === '/') {
    nodeType = '_allnodes';
  }

  let cacheResult = nodeListCache.get(nodeType);
  debug(nodeListCache);

  // msg(`listNodesFromCache - cache result for ${nodeType}: `, cacheResult);

  if (cacheResult) {
    return cacheResult;
  } else {
    return false;
  }
}

module.exports = { loadNodeSync, loadNodeFromCache, loadNodeFileSync, saveNodeSync, nodeCache, nodeListCache, listNodesSync, getKeyFromPath, listNodesFromCache }
