const debug = require('debug')('sonniesedge:utilities:importdata');
const fetchData = require('./fetchdata');
const fs = require('fs');
const config = require('../config');
const path = require('path');
const contentModel = require('../models/content');
const baseUrl = 'https://cms.sonniesedge.net/jsonapi/'
const http = require('http');

const relatedFile = fs.readFileSync(path.join(config.appRoot(), 'temp/related.json'));
const relatedNodes = JSON.parse(relatedFile);

const nodeType = function(nodestring) {
  nodestring = nodestring.replace('node--', '');
  nodestring = nodestring.replace('_', '');
  return nodestring;
}

// foreach in [bookmark, note, post, checkin, static, like, repost, quote, etc]
async function request () {
  
    debug('Importing data...')
    // await fetchData(baseUrl + `node/static`, data, 'Static content. 📜')
    // await fetchData(baseUrl + `node/talk`, data, 'Talk content. 🗣')
    // await fetchData(baseUrl + `node/journey`, data, 'Journey content. ✈️')
    // await fetchData(baseUrl + `node/journal`, data, 'Journal content. ✍️')


    // let posts = []
    // await fetchData(baseUrl + `node/post`, posts, 'Post content. 📖')
    // posts.forEach(item => {
    //   debug('request - Found drupal data: ', item.attributes.path.alias);     
    //   let savePath = path.join('content', 'posts', item.attributes.drupal_internal__nid.toString())

    //   let data = {}

    //   data.guid = item.id;
    //   data.type = nodeType(item.type);
    //   data.id = item.attributes.drupal_internal__nid;
    //   data.title = item.attributes.title;
    //   data.path = item.attributes.path.alias;
    //   data.created = item.attributes.created;
    //   data.changed = item.attributes.changed;
    //   data.strapline = item.attributes.field_strapline;
    //   data.show_in_index = item.attributes.field_index;
    //   data.show_in_rss = item.attributes.field_rss;
    //   data.twitter_summary ? data.twitter_summary = item.attributes.field_twitter_summary : null;
      
    //   let content = '';
    //   if (item.attributes.body && item.attributes.body.value) {
    //     content = item.attributes.body.value;
    //   }

    //   contentModel.submitNodeSync(savePath, data, content);

    // });

    // let bookmarks = []
    // await fetchData(baseUrl + `node/bookmark`, bookmarks, 'Bookmark content. 📌');
    // bookmarks.forEach(item => {
    //   debug('request - Found drupal data: ', item.attributes.path.alias);
    //   let savePath = path.join('content', 'bookmarks', item.attributes.drupal_internal__nid.toString())

    //   let data = {}

    //   data.guid = item.id;
    //   data.type = nodeType(item.type);
    //   data.id = item.attributes.drupal_internal__nid;
    //   data.title = item.attributes.title;
    //   data.path = item.attributes.path.alias;
    //   data.created = item.attributes.created.toString();
    //   data.changed = item.attributes.changed.toString();
    //   data.strapline ? data.strapline = item.attributes.field_strapline : null;
    //   data.show_in_index = item.attributes.field_index;
    //   data.show_in_rss = item.attributes.field_rss;
    //   data.twitter_summary ? data.twitter_summary = item.attributes.field_twitter_summary : null;
    //   data.bookmark_of = item.attributes.field_original_link.uri;
      
    //   let content = '';
    //   if (item.attributes.body && item.attributes.body.value) {
    //     content = item.attributes.body.value;
    //   }

    //   contentModel.submitNodeSync(savePath, data, content);

    // });


    // let likes = []
    // await fetchData(baseUrl + `node/like`, likes, 'Like content. ⭐️')
    // likes.forEach(item => {
    //   debug('request - Found drupal data: ', item.attributes.path.alias);
      
    //   let savePath = path.join('content', 'likes', item.attributes.drupal_internal__nid.toString())

    //   let data = {}

    //   data.guid = item.id;
    //   data.type = nodeType(item.type);
    //   data.id = item.attributes.drupal_internal__nid;
    //   data.title = item.attributes.title;
    //   data.path = item.attributes.path.alias;
    //   data.created = item.attributes.created;
    //   data.changed = item.attributes.changed;
    //   data.strapline ? data.strapline = item.attributes.field_strapline : null;
    //   data.show_in_index = item.attributes.field_index;
    //   data.show_in_rss = item.attributes.field_rss;
    //   data.twitter_summary ? data.twitter_summary = item.attributes.field_twitter_summary : null;
    //   data.like_of = item.attributes.field_like.uri;
      
    //   let content = '';
    //   if (item.attributes.body && item.attributes.body.value) {
    //     content = item.attributes.body.value;
    //   }

    //   contentModel.submitNodeSync(savePath, data, content);

    // });

    // let reposts = []
    // await fetchData(baseUrl + `node/repost`, reposts, 'Repost content. ♻️')
    // reposts.forEach(item => {
    //   debug('request - Found drupal data: ', item.attributes.path.alias);
      
    //   let savePath = path.join('content', 'reposts', item.attributes.drupal_internal__nid.toString())

    //   let data = {}

    //   data.guid = item.id;
    //   data.type = nodeType(item.type);
    //   data.id = item.attributes.drupal_internal__nid;
    //   data.title = item.attributes.title;
    //   data.path = item.attributes.path.alias;
    //   data.created = item.attributes.created;
    //   data.changed = item.attributes.changed;
    //   data.strapline ? data.strapline = item.attributes.field_strapline : null;
    //   data.show_in_index = item.attributes.field_index;
    //   data.show_in_rss = item.attributes.field_rss;
    //   data.twitter_summary ? data.twitter_summary = item.attributes.field_twitter_summary : null;
    //   data.repost_of = item.attributes.field_repost.uri;
      
    //   let content = '';
    //   if (item.attributes.body && item.attributes.body.value) {
    //     content = item.attributes.body.value;
    //   }

    //   contentModel.submitNodeSync(savePath, data, content);

    // });

    // let quotes = []
    // await fetchData(baseUrl + `node/quote`, quotes, 'Quote content. 💬');
    // quotes.forEach(item => {
    //   debug('request - Found drupal data: ', item.attributes.path.alias);
      
    //   let savePath = path.join('content', 'quotes', item.attributes.drupal_internal__nid.toString())

    //   let data = {}

    //   data.guid = item.id;
    //   data.type = nodeType(item.type);
    //   data.id = item.attributes.drupal_internal__nid;
    //   data.title = item.attributes.title;
    //   data.path = item.attributes.path.alias;
    //   data.created = item.attributes.created;
    //   data.changed = item.attributes.changed;
    //   data.strapline ? data.strapline = item.attributes.field_strapline : null;
    //   data.show_in_index = item.attributes.field_index;
    //   data.show_in_rss = item.attributes.field_rss;
    //   data.twitter_summary ? data.twitter_summary = item.attributes.field_twitter_summary : null;
    //   data.quote_of = item.attributes.field_quote_link.uri;
      
    //   let content = '';
    //   if (item.attributes.body && item.attributes.body.value) {
    //     content = item.attributes.body.value;
    //   }

    //   contentModel.submitNodeSync(savePath, data, content);

    // });


    // let bandnames = []
    // await fetchData(baseUrl + `node/band_name`, bandnames, 'Band Name content. 👩‍🎤')
    // bandnames.forEach(item => {
    //   debug('request - Found drupal data: ', item.attributes.path.alias);
      
    //   let savePath = path.join('content', 'bandnames', item.attributes.drupal_internal__nid.toString())

    //   let data = {}

    //   data.guid = item.id;
    //   data.type = nodeType(item.type);
    //   data.id = item.attributes.drupal_internal__nid;
    //   data.title = item.attributes.title;
    //   data.path = item.attributes.path.alias;
    //   data.created = item.attributes.created;
    //   data.changed = item.attributes.changed;
    //   data.strapline ? data.strapline = item.attributes.field_strapline : null;
    //   data.show_in_index = item.attributes.field_index;
    //   data.show_in_rss = item.attributes.field_rss;
    //   data.twitter_summary ? data.twitter_summary = item.attributes.field_twitter_summary : null;
      
    //   let content = '';
    //   if (item.attributes.body && item.attributes.body.value) {
    //     content = item.attributes.body.value;
    //   }

    //   contentModel.submitNodeSync(savePath, data, content);

    // });

    // https://cms.sonniesedge.net/jsonapi/node/check_in/d00bdf34-a9b2-49b0-9aa5-a577e0c693ff?include=field_place_reference
    let checkins = []
    await fetchData(baseUrl + `node/check_in`, checkins, 'Check-in content. 📍')
    checkins.forEach(item => {
      debug('request - Found drupal data: ', item.attributes.path.alias);
      
      let savePath = path.join('checkins', item.attributes.drupal_internal__nid.toString())

      let data = {}

      data.guid = item.id;
      data.type = nodeType(item.type);
      data.id = item.attributes.drupal_internal__nid;
      data.title = item.attributes.title;
      data.path = item.attributes.path.alias;
      data.created = item.attributes.created;
      data.changed = item.attributes.changed;
      data.strapline ? data.strapline = item.attributes.field_strapline : null;
      data.show_in_index = item.attributes.field_index;
      data.show_in_rss = item.attributes.field_rss;
      data.twitter_summary ? data.twitter_summary = item.attributes.field_twitter_summary : null;

      if (item.relationships && item.relationships.field_place_reference) {
        // debug(relatedNodes.filter(relatedNode => relatedNode.id === item.relationships.field_place_reference.data.id)[0].attributes.name)
        // debug(relatedNodes.filter(relatedNode => relatedNode.id === item.relationships.field_place_reference.data.id)[0].attributes.field_geo)
        // data.place = use the GUID reference to lookup data from the monster includes.json file, and return the drupal ID for the taxonomy term
        // data.place = 'taxonomy/place/' + relatedNodes.filter(relatedNode => relatedNode.id === item.relationships.field_place_reference.data.id)[0].attributes.drupal_internal__tid;
        data.place_geo = {}
        data.place_geo.lat = relatedNodes.filter(relatedNode => relatedNode.id === item.relationships.field_place_reference.data.id)[0].attributes.field_geo.lat;
        data.place_geo.lng = relatedNodes.filter(relatedNode => relatedNode.id === item.relationships.field_place_reference.data.id)[0].attributes.field_geo.lng;
        data.place_name = relatedNodes.filter(relatedNode => relatedNode.id === item.relationships.field_place_reference.data.id)[0].attributes.name;
      }

      // attached photos
      if (item.relationships && item.relationships.field_place_reference && item.relationships.field_photo.data && item.relationships.field_photo.data.length > 0) {
        // debug('Item has field_photo', item.relationships.field_photo.data)
        let images = []
        item.relationships.field_photo.data.forEach(element => {
          debug(`Photo node in ${item.attributes.path.alias}: `, element)
          let drupalMediaNode = relatedNodes.filter(relatedNode => (relatedNode.id === element.id))[0];
          debug('Drupal Media Node info: ', drupalMediaNode)
          
          imageData = {}
          imageData.width = drupalMediaNode.relationships.thumbnail.data.data.width
          imageData.height = drupalMediaNode.relationships.thumbnail.data.data.height
          imageData.alt = drupalMediaNode.relationships.thumbnail.data.data.alt

          let fileinfo = relatedNodes.filter(relatedNode => relatedNode.type === 'file--file' && relatedNode.id === drupalMediaNode.relationships.thumbnail.data.id)[0];
          // debug('Drupal file info: ', fileinfo);

          imageData.file = fileinfo.attributes.filename;

          let dataImagePath = path.join(config.contentRoot(), 'checkins', data.id.toString(), 'files')
          let dataImageFetch = 'http://cms.sonniesedge.net' + fileinfo.attributes.uri.url
          debug('Dir to write: ', dataImagePath + '/' + fileinfo.attributes.filename);
          debug('File to download: ', 'http://cms.sonniesedge.net' + fileinfo.attributes.uri.url);
          fs.mkdirSync(dataImagePath, { recursive: true });
          const file = fs.createWriteStream(path.join(dataImagePath, fileinfo.attributes.filename));
          file.on('finish', function() {
            console.log('Wrote: ', path.join(dataImagePath, fileinfo.attributes.filename))
        });
          http.get(dataImageFetch, function(response) {
            response.pipe(file);

            response.on('end', function() {
              console.log('Ended: ', dataImageFetch);
            });
          });
        
          // debug('imageData: ', imageData)
          images.push(imageData);
        });
        data.images = images;
      }
      
      
      let content = '';
      if (item.attributes.body && item.attributes.body.value) {
        content = item.attributes.body.value;
      }

      contentModel.saveNodeSync(savePath, data, content);

    });

    // NOTES (urgh, how do we get the photos out?)
    // let notes = []
    // await fetchData(baseUrl + `node/note`, notes, 'Note content. 🗒')
    // notes.forEach(item => {
    //   // debug('request - Found drupal data: ', item.attributes.path.alias);
      
    //   let savePath = path.join('content', 'notes', item.attributes.drupal_internal__nid.toString())

    //   let data = {}

    //   data.guid = item.id;
    //   data.type = nodeType(item.type);
    //   data.id = item.attributes.drupal_internal__nid;
    //   data.title = item.attributes.title;
    //   data.path = item.attributes.path.alias;
    //   data.created = item.attributes.created;
    //   data.changed = item.attributes.changed;
    //   data.strapline ? data.strapline = item.attributes.field_strapline : null;
    //   data.show_in_index = item.attributes.field_index;
    //   data.show_in_rss = item.attributes.field_rss;
    //   data.twitter_summary ? data.twitter_summary = item.attributes.field_twitter_summary : null;

    //   // attached places
    //   if (item.relationships && item.relationships.field_place_reference && item.relationships.field_place_reference.data) {
    //     data.place_geo = {}
    //     data.place_geo.lat = relatedNodes.filter(relatedNode => relatedNode.id === item.relationships.field_place_reference.data.id)[0].attributes.field_geo.lat;
    //     data.place_geo.lng = relatedNodes.filter(relatedNode => relatedNode.id === item.relationships.field_place_reference.data.id)[0].attributes.field_geo.lng;
    //     data.place_name = relatedNodes.filter(relatedNode => relatedNode.id === item.relationships.field_place_reference.data.id)[0].attributes.name;
    //   }

    //   // attached photos
    //   if (item.relationships && item.relationships.field_place_reference && item.relationships.field_photo.data && item.relationships.field_photo.data.length > 0) {
    //     // debug('Item has field_photo', item.relationships.field_photo.data)
    //     let images = []
    //     item.relationships.field_photo.data.forEach(element => {
    //       // debug(`Photo node in ${item.attributes.path.alias}: `, element)
    //       let drupalMediaNode = relatedNodes.filter(relatedNode => (relatedNode.id === element.id))[0];
    //       // debug('Drupal Media Node info: ', drupalMediaNode)
          
    //       imageData = {}
    //       imageData.width = drupalMediaNode.relationships.thumbnail.data.data.width
    //       imageData.height = drupalMediaNode.relationships.thumbnail.data.data.height
    //       imageData.alt = drupalMediaNode.relationships.thumbnail.data.data.alt

    //       let fileinfo = relatedNodes.filter(relatedNode => relatedNode.type === 'file--file' && relatedNode.id === drupalMediaNode.relationships.thumbnail.data.id)[0];
    //       // debug('Drupal file info: ', fileinfo);

    //       imageData.file = fileinfo.attributes.filename;

    //       let dataImagePath = path.join(config.contentRoot(), 'notes', data.id.toString(), 'files')
    //       let dataImageFetch = 'http://cms.sonniesedge.net' + fileinfo.attributes.uri.url
    //       debug('Dir to write: ', dataImagePath + '/' + fileinfo.attributes.filename);
    //       debug('File to download: ', 'http://cms.sonniesedge.net' + fileinfo.attributes.uri.url);
    //       fs.mkdirSync(dataImagePath, { recursive: true });
    //       const file = fs.createWriteStream(path.join(dataImagePath, fileinfo.attributes.filename));
    //       file.on('finish', function() {
    //         console.log('Wrote: ', path.join(dataImagePath, fileinfo.attributes.filename))
    //     });
    //       http.get(dataImageFetch, function(response) {
    //         response.pipe(file);

    //         response.on('end', function() {
    //           console.log('Ended: ', dataImageFetch);
    //         });
    //       });
        
    //       // debug('imageData: ', imageData)
    //       images.push(imageData);
    //     });
    //     data.images = images;
    //   }
      
    //   let content = '';
    //   if (item.attributes.body && item.attributes.body.value) {
    //     content = item.attributes.body.value;
    //   }

    //   contentModel.submitNodeSync(savePath, data, content);

    // });
}

// Call on load
request();
