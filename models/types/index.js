
let note = require('./note.model')
let bookmark = require('./bookmark.model')
let static = require('./static.model')
let checkin = require('./checkin.model')
let like = require('./like.model')
let reply = require('./reply.model')
let quote = require('./quote.model')
let bandname = require('./bandname.model')
let repost = require('./repost.model')
let photo = require('./photo.model')
let post = require('./post.model')

const modelsList = [
  note, bookmark, static, checkin,
  like, reply, quote, bandname,
  repost, photo, post
]

module.exports = {modelsList}
