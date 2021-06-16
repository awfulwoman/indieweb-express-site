module.exports = {
  id: 'repostOf',
  description: 'Reposting a URL',
  formFieldRender: 'textfield',
  validation: {
    repost_of: {
      in: ['body'],
      isURL: { option: { require_valid_protocol: true } },
      notEmpty: true,
      errorMessage: 'A repost URL is required',
      trim: true
    }
  },
  schema: {}
}
