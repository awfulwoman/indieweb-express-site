module.exports = {
  description: 'XXXXXXXXX',
  formFieldRender: 'boolean',
  validation: {
    hide_from_feed: {
      in: ['body'],
      optional: { options: { nullable: true, checkFalsy: true } },
      toBoolean: true,
      isBoolean: true
    }
  }
}
