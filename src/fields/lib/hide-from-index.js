module.exports = {
  description: 'XXXXXXXXX',
  formFieldRender: 'boolean',
  validation: {
    hide_from_index: {
      in: ['body'],
      optional: { options: { nullable: true, checkFalsy: true } },
      toBoolean: true,
      isBoolean: true
    }
  }
}
