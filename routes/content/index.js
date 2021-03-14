// const article = require('./types/article')
// const bandname = require('./types/bandname')
// const base = require('./base')
// const bookmark = require('./types/bookmark')
// const checkin = require('./types/checkin')
// const like = require('./types/like')
// const note = require('./types/note')
// const photo = require('./types/photo')
// const quote = require('./types/quote')
// const reply = require('./types/reply')
// const repost = require('./types/repost')

// Routes are applied in this order.
// Therefore base should always be last, as it operates at a higher path level than the others
// i.e. /notes/1234 will take priority over /about/image.jpg

// module.exports = [article, bandname, bookmark, checkin, like, note, photo, quote, reply, repost, base]
const types = require('./type')

module.exports = [types]

