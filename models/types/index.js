
let note = require('./note.model')
let bookmark = require('./bookmark.model')
let page = require('./page.model')
let checkin = require('./checkin.model')
let like = require('./like.model')
let reply = require('./reply.model')
let quote = require('./quote.model')
let bandname = require('./bandname.model')
let repost = require('./repost.model')
let photo = require('./photo.model')
let article = require('./article.model')

const modelsList = [
  note, bookmark, page, checkin,
  like, reply, quote, bandname,
  repost, photo, article
]

module.exports = {modelsList}
