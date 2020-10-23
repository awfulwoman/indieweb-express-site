const debug = require('debug')('sonniesedge:models:listModels')

let note = require('./types/note.model')
let bookmark = require('./types/bookmark.model')
let static = require('./types/static.model')
let checkin = require('./types/checkin.model')
let like = require('./types/like.model')
let reply = require('./types/reply.model')
let quote = require('./types/quote.model')
let bandname = require('./types/bandname.model')
let repost = require('./types/repost.model')
let photo = require('./types/photo.model')
let post = require('./types/post.model')

const modelsList = [
  note, bookmark, static, checkin,
  like, reply, quote, bandname,
  repost, photo, post
]

module.exports = modelsList
