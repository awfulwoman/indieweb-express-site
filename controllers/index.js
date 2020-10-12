const bookmark = require('./bookmark.controller')
const note = require('./note.controller')
const static = require('./static.controller')

// Routes are applied in this order. 
// Therefore static should always be last, as it operates at a higher path level than the others
// e.g. /notes/1234 should take priority over /about/image.jpg
module.exports = [bookmark, note, static]
