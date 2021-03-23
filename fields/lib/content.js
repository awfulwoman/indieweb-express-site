module.exports = {
  id: 'content',
  description: 'The main page content',
  formFieldRender: 'textfield',
  validation: {
    content: {
      in: ['body'],
      isString: true,
      errorMessage: 'You need to provide some content',
      // trim: true
    }
  }
}
