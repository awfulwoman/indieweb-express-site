module.exports = {
  id: 'quoteOf',
  description: 'Quoting a URL',
  formFieldRender: 'textfield',
  validation: {
    quote_of: {
      in: ['body'],
      // notEmpty: true,
      errorMessage: 'A quote URL is required',
      trim: true,
      isURL: {
        option: {
          require_protocol: true,
          require_valid_protocol: true
        },
        errorMessage: 'A valid URL is required'
      }
    }
  },
  schema: {}
}
