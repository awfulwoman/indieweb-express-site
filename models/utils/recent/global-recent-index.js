
const debug = require('debug')('sonniesedge:model:utils:recent:globalRecentIndex')
const {orderBy} = require('natural-orderby')
const {modelsArray} = require('../../types')
const ErrorHandler = require('../../../utilities/error-handler')

const globalRecentIndex = async (limit=20) => {
  try {
    let recentItems = []
    for (let index = 0; index < modelsArray.length; index++) {
      if(modelsArray[index].recentIndex) {
        for (let [key, value] of Object.entries(await modelsArray[index].recentIndex())) {
          recentItems.push(value)
        }      
      }
    }
  
    let recentItemsSorted = orderBy(
      recentItems, 
      [v => v.data.created],
      ['desc']
      )

    return recentItemsSorted.slice(0, limit)
  } catch (error) {
    throw error
  }
}

module.exports = globalRecentIndex
