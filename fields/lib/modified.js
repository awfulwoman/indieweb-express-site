module.exports = {
  id: 'modified',
  validation: {
    modified: {
      isISO8601: true,
      optional: { options: { nullable: true, checkFalsy: true } }
    }
  },
  field: {
    type: 'string',
    description: 'The modification date',
    formFieldRender: 'textfield'
  }
}
