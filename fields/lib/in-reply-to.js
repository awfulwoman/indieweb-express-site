module.exports = {
  id: 'inReplyTo',
  description: 'Replying to a URL',
  formFieldRender: 'textfield',
  validation: {
    in_reply_to: {
      in: ['body'],
      isURL: { option: { require_valid_protocol: true } },
      notEmpty: true,
      errorMessage: 'An in_reply_to URL is required',
      trim: true
    }
  },
  schema: {}
}
