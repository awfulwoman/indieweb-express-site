const debug = require('debug')('sonniesedge:controllers:utils:feed:feedBase')
const feedSettings = require('./feed.settings')
const Feed = require('feed').Feed
const { DateTime } = require("luxon")
const is = require('is_js')


const generateBaseFeed = async (model) => {
  try {
    if (!model) throw new Error('Model must be supplied')
    if (!model.recentFeed && !model.globalRecentFeed) throw new Error('model must be a model object with a recentFeed() or globalRecentFeed() function')
    let feed = new Feed(feedSettings()) 
    let recents = model.globalRecentFeed ? await model.globalRecentFeed() : await model.recentFeed()
  
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
