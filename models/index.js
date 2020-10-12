const debug = require('debug')('sonniesedge:models')
let note = require('./note.model')
let bookmark = require('./bookmark.model')
let static = require('./static.model')
let naturalSort = require('javascript-natural-sort')

const models = [note, bookmark, static]

const warmAll = async () => {
  for (let index = 0; index < models.length; index++) {
    if(models[index].warm) {
      await models[index].warm()
    }
  }
}

const recent = async () => {
  let recentItems = []
  for (let index = 0; index < models.length; index++) {
    if(models[index].recent) {
      
      for (let [key, value] of Object.entries(await models[index].recent())) {
        // debug(value)
        recentItems.push(value)
      }
    
      return recentItems.sort(naturalSort).slice(0, 20)
    }
  }
}


module.exports = {models, warmAll, recent}
