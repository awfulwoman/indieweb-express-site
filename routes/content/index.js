const bookmark = require('./bookmark.controller')
const note = require('./note.controller')
const page = require('./page.controller')
const bandname = require('./bandname.controller')
const like = require('./like.controller')
const photo = require('./photo.controller')
const quote = require('./quote.controller')
const reply = require('./reply.controller')
const repost = require('./repost.controller')
const article = require('./article.controller')

// Routes are applied in this order. 
// Therefore page should always be last, as it operates at a higher path level than the others
// e.g. /notes/1234 should take priority over /about/image.jpg
module.exports = [bookmark, note, bandname, article, like, photo, quote, reply, repost, page]
