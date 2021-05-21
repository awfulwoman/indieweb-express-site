const debug = require('debug')('indieweb-express-site:controllers:feed:base')
const feedSettings = require('./settings')
const Feed = require('feed').Feed
const { DateTime } = require('luxon')
const { md } = require('../../utilities')

const generateBaseFeed = async (model) => {
  if (!model) throw new Error('Model must be supplied')
  if (!model.recentFeed && !model.globalRecentFeed) throw new Error('model must be a model object with a recentFeed() or globalRecentFeed() function')
  let feed = new Feed(feedSettings())
  let recents = model.globalRecentFeed ? await model.globalRecentFeed() : await model.recentFeed()

  recents.forEach(item => {

    let renderedContentWithAdditionalData = item.content
    renderedContentWithAdditionalData += '\n\n'
    if (item.data.bookmark_of) renderedContentWithAdditionalData += '[View the bookmarked URL](' + item.data.bookmark_of + ') \n\n'
    if (item.data.like_of) renderedContentWithAdditionalData += '[View the liked URL](' + item.data.like_of + ') \n\n'
    if (item.data.repost_of) renderedContentWithAdditionalData += '[View the reposted URL](' + item.data.repost_of + ') \n\n'
    if (item.data.quote_of) renderedContentWithAdditionalData += '[View the quoted URL](' + item.data.quote_of + ') \n\n'
    if (item.data.in_reply_to) renderedContentWithAdditionalData += '[View the URL being replied to](' + item.data.in_reply_to + ') \n\n'

    if (item.data.images) {
      item.data.images.forEach(image => {
        renderedContentWithAdditionalData += `![${image.alt || ''}](${item.url}/${image.file}/600) \n\n`
      })
    }

    feed.addItem({
      title: item.data.title,
      description: item.strapline || item.excerpt.plain,
      content: md.render(renderedContentWithAdditionalData),
      id: item.url,
      link: item.url,
      date: new Date(DateTime.fromISO(item.data.created))
    })
  })

  return feed
}

module.exports = generateBaseFeed
