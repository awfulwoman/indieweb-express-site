const debug = require('debug')('indieweb-express-site:nav')

const nav = (originalUrl) => {

  let baseNavList = [
    {
      path: '/about',
      text: 'About'
    },
    {
      path: '/articles',
      text: 'Articles'
    },
    {
      path: '/notes',
      text: 'Notes'
    },
    {
      path: '/bookmarks',
      text: 'Bookmarks'
    },
    {
      path: '/contact',
      text: 'Contact'
    }
  ]

  let urlPathArray = originalUrl.substring(1).split('/')

  for (const item of baseNavList) {
    if (item.path == `/${urlPathArray[0]}`) item.active = true
  }

  return baseNavList
}

module.exports = nav
