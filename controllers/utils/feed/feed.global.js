const debug = require('debug')('sonniesedge:controllers:utils:feed:feedGlobal')
const config = require('../../../config')

const feedGlobal = () => {
  return {
    title: config.siteTitle,
    description: config.siteDescription,
    id: config.siteUrl,
    link: config.siteUrl,
    language: 'en', // optional, used only in RSS 2.0, possible values: http://www.w3.org/TR/REC-html40/struct/dirlang.html#langcodes
    image: `${config.siteUrl}/whatever.jpg`,
    favicon: `${config.siteUrl}/favicon.ico`,
    copyright: "All rights reserved 2020, Charlie Owen",
    author: {
      name: "Charlie Owen",
      email: "herself+rss@sonniesedge.net",
      link: `${config.siteUrl}/about`
    }
  }
}

module.exports = feedGlobal
