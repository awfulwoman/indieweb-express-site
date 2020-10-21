const debug = require('debug')('sonniesedge:controllers:utils:content:rssGet')
const asyncHandler = require('express-async-handler')
const Feed = require('feed').Feed
const feedGlobal = require('./feed.global')

const rssGet = (model, options) => {
  options || (options = {});
  return asyncHandler(async (req, res, next) => {

    try {
      let feed = new Feed(feedGlobal())
      let recents = await model.recent()

      recents.forEach(item => {
        feed.addItem({
          title: item.data.title,
          description: item.rendered,
          content: item.rendered,
          id: item.fullUrl,
          link: item.fullUrl
          // date: Date.parse(item.data.created)
        })
      });

      res.contentType('application/rss+xml')
      res.send(feed.rss2())
    } catch (error) {
      debug(error)
      throw new ErrorHandler('404', error)
    }
  })
}

module.exports = rssGet
