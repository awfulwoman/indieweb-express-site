module.exports = {
  description: 'A title for your content',
  formFieldRender: 'textfield',
  validation: {
    title: {
      in: ['body'],
      isString: true,
      notEmpty: true,
      // errorMessage: 'A title is required',
      trim: true
    }
  }
}