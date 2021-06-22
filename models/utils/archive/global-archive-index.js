
const debug = require('debug')('indieweb-express-site:model:utils:recent:globalArchiveIndex')
const {orderBy} = require('natural-orderby')
const {modelsArray} = require('../../types')
const AppError = require('../../../utilities/app-error')

const globalArchiveIndex = async (dateObj) => {
  try {
    let recentItems = []
    for (let index = 0; index < modelsArray.length; index++) {
      if(modelsArray[index].recentIndex) {
        for (let [key, value] of Object.entries(await modelsArray[index].archiveIndex(dateObj))) {
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
