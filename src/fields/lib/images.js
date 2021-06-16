const Joi = require('joi')

module.exports = {
  id: 'images',
  description: 'Images attached to this piece of content',
  formFieldRender: 'images',
  validation: {
    'images.*.file': {
      in: ['body'],
      optional: { options: { nullable: true, checkFalsy: true } },
      isString: true
    },
    'images.*.alt': {
      in: ['body'],
      optional: { options: { nullable: true, checkFalsy: true } },
      isString: true,
      trim: true
    },
    'images.*.width': {
      in: ['body'],
      optional: { options: { nullable: true, checkFalsy: true } },
      toInt: true,
      isInt: true
    },
    'images.*.height': {
      in: ['body'],
      optional: { options: { nullable: true, checkFalsy: true } },
      toInt: true,
      isInt: true
    },
    'images.*.size': {
      in: ['body'],
      optional: { options: { nullable: true, checkFalsy: true } },
      toInt: true,
      isInt: true
    }
  },
  schema: Joi.array().items(
    Joi.object({
      file: Joi.string(),
      alt: Joi.string(),
      width: Joi.number(),
      height: Joi.number()
    })
  )
}
