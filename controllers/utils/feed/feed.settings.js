const debug = require('debug')('sonniesedge:controllers:utils:feed:feedGlobal')
const config = require('../../../config')

const settings = () => {
  return {
    title: config.siteTitle(),
    description: config.siteDescription(),
    id: config.siteUrl(),
    link: config.siteUrl(),
    language: 'en', 
    image: `${config.siteUrl()}/whatever.jpg`,
    favicon: `${config.siteUrl()}/favicon.ico`,
    copyright: "All rights reserved 2020, Charlie Owen, etc, etc",
    author: {
      name: "Charlie Owen",
      email: "herself+rss@sonniesedge.net",
      link: `${config.siteUrl()}/about`
    }
  }
}

module.exports = settings
