const fetch = require('node-fetch');
constjsonSize = require('json-size');

function formatBytes(bytes, decimals = 2) {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];

  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}

// Pass in a link, and an array to store results in.
const fetchData = (link, store, contentType, showSize = false) => {
  return fetch(link)
    .then(response => {
      return response.ok ? response.json() : Promise.reject(response.statusText)
    })
    .then(document => {
      // Add whatever objects we get to the store array
      store.push(...document.data)
      // JSONAPI data is paginated. If there is a "next" link, fetch data from that and call self.
      if (document.links.hasOwnProperty('next')) {
        return fetchData(document.links.next, store, contentType, showSize)
      } else {
        // If there's no more pagination, return what we have.
        let sizeo = 'loads'
        if (showSize) {
          sizeo = formatBytes(jsonSize(store))
        }
        console.log(`Got ${sizeo} of ${contentType}`)
        // console.log(store)
        return store
      }
    })
    .catch(console.log)
}

module.exports = fetchData;
