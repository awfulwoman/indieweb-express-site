const debug = require('debug')('indieweb-express-site:controllers:feed:base')
const feedSettings = require('./settings')
const Feed = require('feed').Feed
const { DateTime } = require("luxon")
const is = require('is_js')
const AppError = require('../../utilities/app-error')
const md = require('../../utilities/markdown-it')


const generateBaseFeed = async (model) => {
  try {
    if (!model) throw new Error('Model must be supplied')
    if (!model.recentFeed && !model.globalRecentFeed) throw new Error('model must be a model object with a recentFeed() or globalRecentFeed() function')
    let feed = new Feed(feedSettings()) 
    let recents = model.globalRecentFeed ? await model.globalRecentFeed() : await model.recentFeed()
  
    recents.forEach(item => {

      let renderedContentWithAdditionalData = item.content
      renderedContentWithAdditionalData += '\n\n'
      if (item.data.bookmark_of) renderedContentWithAdditionalData += '[View bookmarked URL](' +  item.data.bookmark_of + ') \n\n'
      if (item.data.like_of) renderedContentWithAdditionalData += '[View liked URL](' +  item.data.like_of + ') \n\n'
      if (item.data.repost_of) renderedContentWithAdditionalData += '[View reposted URL](' +  item.data.repost_of + ') \n\n'
      if (item.data.quote_of) renderedContentWithAdditionalData += '[View quoted URL](' +  item.data.quote_of + ') \n\n'
      if (item.data.reply_to) renderedContentWithAdditionalData += '[View URL being replied to](' +  item.data.reply_to + ') \n\n'

      if (item.data.images) {
        item.data.images.forEach(image => {
          renderedContentWithAdditionalData += `[${image.alt}](${item.url}/${image.file}/600) \n\n`
        })
      }
      
      
      feed.addItem({
        title: item.data.title,
        description: item.rendered,
        content: md.render(renderedContentWithAdditionalData),
        id: item.url,
        link: item.url,
        date: new Date(DateTime.fromISO(item.data.created))
      })
    })

    return feed
  } catch (error) {
    throw error
  }
}

module.exports = generateBaseFeed
