const debug = require('debug')('sonniesedge:nav')

const nav = (originalUrl) => {

  let baseNavList = [
    {
      path: '/about',
      text: 'About'
    },
    {
      path: '/posts',
      text: 'Posts'
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
