const debug = require('debug')('sonniesedge:controllers:utils:content:rssGet')
const feedSettings = require('./feed.settings')
const Feed = require('feed').Feed
const { DateTime } = require("luxon");


const generateBaseFeed = async (model) => {
  try {
    let feed = new Feed(feedSettings())
    let recents = await model.recent()
  
    recents.forEach(item => {
      feed.addItem({
        title: item.data.title,
        description: item.rendered,
        content: item.rendered,
        id: item.fullUrl,
        link: item.fullUrl,
        date: new Date(DateTime.fromISO(item.data.created))
      })
    })

    return feed
  } catch (error) {
    debug(error)
    throw error
  }
}

module.exports = generateBaseFeed
