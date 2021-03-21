module.exports = {
  id: 'created',
  validation: {
    created: {
      isISO8601: true,
      optional: {
        options: {
          nullable: true,
          checkFalsy: true
        }
      }
    }
  },
  field: {
    type: 'string',
    description: 'The creation date',
    formFieldRender: 'textfield'
  }
}
