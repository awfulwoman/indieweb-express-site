const debug = require('debug')('sonniesedge:nav')

const nav = (currentId) => {
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

for (const item of baseNavList) {
  if (item.path === `/${currentId}`) {
    item.activeClass = 'active'
  }
}

  return baseNavList
}

module.exports = nav
