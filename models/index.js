const debug = require('debug')('sonniesedge:models')
let note = require('./note.model')
let bookmark = require('./bookmark.model')
let static = require('./static.model')
let naturalSort = require('javascript-natural-sort')
const {orderBy} = require('natural-orderby');

const models = [note, bookmark, static]

const warmAll = async () => {
  for (let index = 0; index < models.length; index++) {
    if(models[index].warm) {
      await models[index].warm()
    }
  }
}

const recent = async () => {
  try {
    let recentItems = []

    for (let index = 0; index < models.length; index++) {
      debug(models[index].modelDir)
      if(models[index].recent) {
        
        for (let [key, value] of Object.entries(await models[index].recent())) {
          // debug(value)
          recentItems.push(value)
        }      
      }
    }
  
    let sorted = orderBy(
      recentItems, 
      [v => v.data.created],
      ['desc']
      )
  
    return sorted.slice(0, 20)
  } catch (error) {
    throw error
  }

}


module.exports = {models, warmAll, recent}
