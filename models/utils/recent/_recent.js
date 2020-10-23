const debug = require('debug')('sonniesedge:model:utils:recent:_recent')
const {orderBy} = require('natural-orderby');
const {modelsList} = require('../../types')

const _recent = async () => {
  try {
    let recentItems = []
    for (let index = 0; index < modelsList.length; index++) {
      if(modelsList[index].recentIndex) {
        for (let [key, value] of Object.entries(await modelsList[index].recentIndex())) {
          recentItems.push(value)
        }      
      }
    }
  
    let recentItemsSorted = orderBy(
      recentItems, 
      [v => v.data.created],
      ['desc']
      )

    return recentItemsSorted
  } catch (error) {
    debug(error)
    throw error
  }
}

module.exports = _recent
