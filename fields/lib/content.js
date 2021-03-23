module.exports = {
  id: 'content',
  description: 'The main page content',
  formFieldRender: 'textfield',
  validation: {
    content: {
      in: ['body'],
      isString: true
    }
  }
}
