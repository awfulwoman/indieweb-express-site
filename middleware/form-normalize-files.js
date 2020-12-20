const qs = require('qs')
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


const normalizeFiles = (req,res,next) => {
  // Add uploaded files to relevant req.body objects
  if (!req.files) next()

  let tempBodyObj = {}
  for (const file of req.files) {
    let result = qs.parse(`${file['fieldname']}=${file['originalname']}`)
    tempBodyObj = merge(tempBodyObj, result)
  }
  for (const item in tempBodyObj) {
    if (Object.hasOwnProperty.call(tempBodyObj, item)) {
      const element = tempBodyObj[item];
      req['body'][item] = merge(req['body'][item], tempBodyObj[item], { arrayMerge: combineMerge })
    }
  }
  next()
}

module.exports = normalizeFiles
