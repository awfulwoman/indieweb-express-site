const debug = require('debug')('sonniesedge:model')

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

const {orderBy} = require('natural-orderby');

const models = [
  note, 
  bookmark, 
  static,
  checkin,
  like,
  reply,
  quote,
  bandname,
  repost,
  photo,
  post
]

const warmAll = async () => {
  for (let index = 0; index < models.length; index++) {
    if(models[index].warm) {
      await models[index].warm()
    }
  }
}

const recent = async (limit=20) => {
  try {
    let recentItems = []

    for (let index = 0; index < models.length; index++) {
      if(models[index].recent) {
        for (let [key, value] of Object.entries(await models[index].recent())) {
          recentItems.push(value)
        }      
      }
    }
  
    let sorted = orderBy(
      recentItems, 
      [v => v.data.created],
      ['desc']
      )
  
    return sorted.slice(0, limit)
  } catch (error) {
    throw error
  }

}

module.exports = {models, warmAll, recent}
