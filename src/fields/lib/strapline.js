module.exports = {
  id: 'strapline',
  description: 'A strapline for this item',
  formFieldRender: 'textfield',
  validation: {
    strapline: {
      in: ['body'],
      isString: true,
      notEmpty: true,
      // errorMessage: 'You need to provide some content',
      trim: true
    }
  }
}
