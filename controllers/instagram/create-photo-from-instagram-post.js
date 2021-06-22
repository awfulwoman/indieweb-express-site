// const ig = require('instagram-scraping')
const debug = require('debug')('indieweb-express-site:controllers:instagram:createPhotoFromInstagramPost')
const contentControllers = require('../content')

const createPhotoFromInstagramPost = async (instagramPostData) => {
  try {
    debug(instagramPostData)
    if (!instagramPostData.id) throw new Error('This is not an instagram post object')

    // let newResult = {}

    // newResult.instagramItemType = item.node.__typename
    // newResult.instagramId = ''
    // newResult.instagramShortcode = ''
    // newResult.items = []
    // newResult.content = item.node.edge_media_to_caption.edges[0].node.text

    // if (item.node.__typename === 'GraphSidecar') {
    //   // multiple media items
    //   for (const sidecarItem of item.node.edge_sidecar_to_children.edges) {
    //     newResult.items.push({
    //       mediaUrl: sidecarItem.node.is_video ? sidecarItem.node.video_url : sidecarItem.node.display_url,
    //       mediaAlt: sidecarItem.node.accessibility_caption,
    //       height: '',
    //       width: ''
    //     })
    //   }
    // } else {
    //   // a single media item
    //   newResult.items.push({
    //     mediaUrl: item.node.is_video ? item.node.video_url : item.node.display_url,
    //     mediaAlt: item.node.accessibility_caption,
    //     height: '',
    //     width: ''
    //   })
    // }

  } catch (error) {
    console.log(error)
    throw error
  }

}

module.exports = createPhotoFromInstagramPost
