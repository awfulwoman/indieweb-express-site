module.exports = {
  description: 'XXXXXXXXX',
  formFieldRender: 'boolean',
  validation: {
    private: {
      in: ['body'],
      optional: { options: { nullable: true, checkFalsy: true } },
      toBoolean: true,
      isBoolean: true
    }
  }
}
