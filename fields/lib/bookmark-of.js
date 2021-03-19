module.exports = {
  id: 'bookmarkOf',
  description: 'A title for your content',
  formFieldRender: 'textfield',
  validation: {
    bookmark_of: {
      in: ['body'],
      isURL: { option: { require_valid_protocol: true } },
      notEmpty: true,
      errorMessage: 'A bookmark URL is required',
      trim: true
    }
  },
  schema: {}
}
