module.exports = {
  id: 'replyTo',
  description: 'Replying to a URL',
  formFieldRender: 'textfield',
  validation: {
    reply_to: {
      in: ['body'],
      isUrl: { option: { require_valid_protocol: true } },
      notEmpty: true,
      errorMessage: 'A reply URL is required',
      trim: true
    }
  },
  schema: {}
}
