const debug = require('debug')('sonniesedge:models:utils:cache:warmAll')
const {modelsArray} = require('../../types')
const ErrorHandler = require('../../../utilities/error-handler')

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
