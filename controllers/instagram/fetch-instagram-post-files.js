const debug = require('debug')('indieweb-express-site:controllers:instagram:fetchInstagramPostFiles')
const path = require('path')

const config = require('../../config')
const utilities = require('../../utilities')

// Returns an array of file objects
// [
//   {
//     encoding: '7bit',
//     mimetype: 'image/png',
//     destination: '/tmp/fileuploads',
//     filename: 'images-0-file-20210419t154121-14223034.png',
//     path: '/tmp/fileuploads/images-0-file-20210419t154121-14223034.png',
//     size: 1854115
//   }
// ]
const fetchInstagramPostFiles = async (instagramObject, renderMessages, options = {}) => {
  try {
    // Check argument validity


    // create a storage array

    // Find media URLs

    // for each media URL...
      // create a temp object
      // Download file from media URL to temp dir
      // Gather basic data
      // push object to array


    // Return array of download objects

  } catch (error) {
    renderMessages.push(error.message)
    throw error
  }
}

module.exports = fetchInstagramPostFiles
