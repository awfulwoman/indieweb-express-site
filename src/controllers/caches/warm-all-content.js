const debug = require('debug')('indieweb-express-site:controllers:caches:warmAll')
const {modelsArray} = require('../../models/types')

const warmAll = async () => {
  try {
    for (let index = 0; index < modelsArray.length; index++) {
      if(modelsArray[index].warm) {
        await modelsArray[index].warm()
      }
    }
  } catch (error) {
    throw error
  }

}

module.exports = warmAll
