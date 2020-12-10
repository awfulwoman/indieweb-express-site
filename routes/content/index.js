const bookmark = require('./types/bookmark')
const note = require('./types/note')
const base = require('./base')
const bandname = require('./types/bandname')
const like = require('./types/like')
const photo = require('./types/photo')
const quote = require('./types/quote')
const reply = require('./types/reply')
const repost = require('./types/repost')
const article = require('./types/article')

// Routes are applied in this order. 
// Therefore page should always be last, as it operates at a higher path level than the others
// e.g. /notes/1234 should take priority over /about/image.jpg
module.exports = [bookmark, note, bandname, article, like, photo, quote, reply, repost, base]
