const debug = require('debug')('sonniesedge:middleware:normalizeFiles')
const merge = require('deepmerge')

// TODO: modularise
const combineMerge = (target, source, options) => {
  const destination = target.slice()

  source.forEach((item, index) => {
    if (typeof destination[index] === 'undefined') {
      destination[index] = options.cloneUnlessOtherwiseSpecified(item, options)
    } else if (options.isMergeableObject(item)) {
      destination[index] = merge(target[index], item, options)
    } else if (target.indexOf(item) === -1) {
      destination.push(item)
    }
  })
  return destination
}

const normalizeFiles = (req, res, next) => {
  // Add uploaded file data to req.body
  if (!req.files) next()
  debug(req.uploads)
  debug('---------')

  for (const uploadGroup in req.uploads) {
    if (Object.hasOwnProperty.call(req.uploads, uploadGroup)) {
      debug(uploadGroup)
      debug(req.uploads[uploadGroup])

      if (req['body'][uploadGroup]) req['body'][uploadGroup] = merge(req['body'][uploadGroup], req.uploads[uploadGroup], { arrayMerge: combineMerge })
      
    }
  }



  // for (const uploadGroup of req.uploads) {
  //   for (const x of Object.getOwnPropertyNames(uploadGroup)) {
  //     debug(x);
  //   }
  // }

  // req.body = merge(req.body, ...req.uploads, { arrayMerge: combineMerge })
  next()
}

module.exports = normalizeFiles
