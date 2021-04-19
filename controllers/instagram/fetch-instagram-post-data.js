// const ig = require('instagram-scraping')
const fetch = require('node-fetch')
const debug = require('debug')('indieweb-express-site:controllers:content:instagram:fetchInstagramPostData')

const fetchInstagramPostData = async (instagramPostUrl) => {
  try {
    if (!instagramPostUrl) throw new Error('No Instagram post URL supplied')
    // let results = await ig.scrapeUserPage(username)
    let fetchResponse = await fetch(instagramPostUrl + '?__a=1', {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_6) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.0.3 Safari/605.1.15'
      }
    })
    let results = await fetchResponse.json()
    debug('fetchInstagram results', results)

    if (!results.graphql && !results.graphql.shortcode_media) throw new Error('Bad JSON returned by Instagram')

    return results.graphql.shortcode_media

    
  
    // if (!results.user.edge_owner_to_timeline_media.edges ) throw new Error('instagram-scraping did not return expected data')
  
    // return results.user.edge_owner_to_timeline_media.edges.map(item => {
    //   console.log(JSON.stringify(item, null, 2))
  
    //   let newResult = {}
  
    //   newResult.instagramItemType = item.node.__typename
    //   newResult.instagramId = ''
    //   newResult.instagramShortcode = ''
    //   newResult.items = []
    //   newResult.content = item.node.edge_media_to_caption.edges[0].node.text
  
    //   if (item.node.__typename === 'GraphSidecar') {
    //     // multiple media items
    //     for (const sidecarItem of item.node.edge_sidecar_to_children.edges) {
    //       newResult.items.push({
    //         mediaUrl: sidecarItem.node.is_video ? sidecarItem.node.video_url : sidecarItem.node.display_url,
    //         mediaAlt: sidecarItem.node.accessibility_caption,
    //         height: '',
    //         width: ''
    //       })
    //     }
    //   } else {
    //     // a single media item
    //     newResult.items.push({
    //       mediaUrl: item.node.is_video ? item.node.video_url : item.node.display_url,
    //       mediaAlt: item.node.accessibility_caption,
    //       height: '',
    //       width: ''
    //     })
    //   }
  
    //   return newResult
  
    // })
  } catch (error) {
    console.log(error)
    throw error
  }

}

module.exports = fetchInstagramPostData
