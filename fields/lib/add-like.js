module.exports = {
  description: 'XXXXXXXXX',
  formFieldRender: 'textfield',
  validation: {
    add_like: {
      in: ['body'],
      optional: { options: { nullable: true, checkFalsy: true } },
      toBoolean: true,
      isBoolean: true
    }
  }
}
