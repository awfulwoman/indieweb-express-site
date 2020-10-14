const bookmark = require('./types/bookmark.controller')
const note = require('./types/note.controller')
const static = require('./types/static.controller')
const bandname = require('./types/bandname.controller')
const like = require('./types/like.controller')
const photo = require('./types/photo.controller')
const quote = require('./types/quote.controller')
const reply = require('./types/reply.controller')
const repost = require('./types/repost.controller')
const post = require('./types/post.controller')


// Routes are applied in this order. 
// Therefore static should always be last, as it operates at a higher path level than the others
// e.g. /notes/1234 should take priority over /about/image.jpg
module.exports = [bookmark, note, bandname, post, like, photo, quote, reply, repost, static]
