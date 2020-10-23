const debug = require('debug')('sonniesedge:controllers:utils:feed:feedGlobal')
const feedSettings = require('./feed.settings')
const Feed = require('feed').Feed
const { DateTime } = require("luxon")
const is = require('is_js')


const generateBaseFeed = async (model) => {
  try {
    if (!model) throw new Error('Model must be supplied')
    if (!model.recentFeed) throw new Error('model must be a model object with a recentFeed() function')
    if (is.falsy(model.settings.generateOwnRssFeed)) throw new Error(`Not allowed to generate feed for ${model.modelDir}.`)
    let feed = new Feed(feedSettings()) 
    let recents = await model.recentFeed()
  
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
