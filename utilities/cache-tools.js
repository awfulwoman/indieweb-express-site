const debug = require('debug')('sonniesedge:app');
const is = require('is_js')

const warmAll = async (models) => {
  debug(models)
  try {
    if (!models) {throw new Error('All parameters must be supplied')}
    if (is.not.array(models)) {throw new Error('models must be an array of models')}
    for (let index = 0; index < models.length; index++) {
      debug(`Warming up ${models[index].modelDir} cache`)
      if (models[index].warm) { await models[index].warm() }
    }
  } catch (error) {
    debug(`Warning: `, error)
    // TODO: Add to logging
    // Don't throw an error/reject Promise here because where's it gonna go? TO THE MOON?
    // Don't render a page here because the warm cache method of a model us low-level
  }
}

module.exports = {warmAll}
