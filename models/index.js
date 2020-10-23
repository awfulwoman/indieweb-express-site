const debug = require('debug')('sonniesedge:model')
const {globalRecentIndex, globalRecentFeed} = require('./utils/recent')

const note = require('./types/note.model')
const bookmark = require('./types/bookmark.model')
const static = require('./types/static.model')
const checkin = require('./types/checkin.model')
const like = require('./types/like.model')
const reply = require('./types/reply.model')
const quote = require('./types/quote.model')
const bandname = require('./types/bandname.model')
const repost = require('./types/repost.model')
const photo = require('./types/photo.model')
const post = require('./types/post.model')

const modelsList = [
  note, bookmark, static, checkin,
  like, reply, quote, bandname,
  repost, photo, post
]

module.exports = {modelsList, globalRecentIndex, globalRecentFeed}
