module.exports = {
  description: 'Add an additional "like" to an item that is not primarily about likes',
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
