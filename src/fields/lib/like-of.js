module.exports = {
  id: 'likeOf',
  description: 'Liking a URL',
  formFieldRender: 'textfield',
  validation: {
    like_of: {
      in: ['body'],
      isURL: { option: { require_valid_protocol: true } },
      notEmpty: true,
      errorMessage: 'A like URL is required',
      trim: true
    }
  },
  schema: {}
}
