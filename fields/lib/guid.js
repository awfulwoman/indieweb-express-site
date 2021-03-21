module.exports = {
  id: 'guid',
  validation: {
    guid: {
      in: ['body'],
      optional: {
        options: {
          nullable: true,
          checkFalsy: true
        }
      },
      isUUID: true,
      errorMessage: 'This must be in a UUIDv4 format',
      trim: true
    }
  },
  field: {
    type: 'string',
    description: 'A UUID for this content',
    formFieldRender: 'textfield'
  }
}
