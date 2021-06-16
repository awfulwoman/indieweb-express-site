
let note = require('./note.model')
let bookmark = require('./bookmark.model')
let checkin = require('./checkin.model')
let like = require('./like.model')
let reply = require('./reply.model')
let quote = require('./quote.model')
let bandname = require('./bandname.model')
let repost = require('./repost.model')
let photo = require('./photo.model')
let article = require('./article.model')

const modelsArray = [
  note, bookmark, checkin,
  like, reply, quote, bandname,
  repost, photo, article
]

const arrayToObject = (array) =>
  array.reduce((obj, item) => {
    obj[item.id] = item
    return obj
  }, {})

let models = arrayToObject(modelsArray)

module.exports = { modelsArray, models }
