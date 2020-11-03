const debug = require('debug')('sonniesedge:models:utils:cache:warmAll')
const {modelsList} = require('../../types')
const ErrorHandler = require('../../../utilities/error-handler')

const warmAll = async () => {
  try {
    for (let index = 0; index < modelsList.length; index++) {
      if(modelsList[index].warm) {
        await modelsList[index].warm()
      }
    }
  } catch (error) {
    throw error
  }

}

module.exports = warmAll
