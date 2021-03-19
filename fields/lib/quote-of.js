module.exports = {
  id: 'quoteOf',
  description: 'Quoting a URL',
  formFieldRender: 'textfield',
  validation: {
    like_of: {
      in: ['body'],
      isUrl: { option: { require_valid_protocol: true } },
      notEmpty: true,
      errorMessage: 'A quote URL is required',
      trim: true
    }
  },
  schema: {}
}
