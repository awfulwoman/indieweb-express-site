
const debug = require('debug')('sonniesedge:model:utils:recent:globalArchiveIndex')
const {orderBy} = require('natural-orderby')
const {modelsList} = require('../../types')
const ErrorHandler = require('../../../utilities/error-handler')

const globalArchiveIndex = async (dateObj) => {
  try {
    let recentItems = []
    for (let index = 0; index < modelsList.length; index++) {
      if(modelsList[index].recentIndex) {
        for (let [key, value] of Object.entries(await modelsList[index].archiveIndex(dateObj))) {
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
    throw error
  }
}

module.exports = globalArchiveIndex
