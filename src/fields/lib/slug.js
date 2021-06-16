module.exports = {
  id: 'slug',
  description: 'A slug for this item',
  formFieldRender: 'textfield',
  validation: {
    slug: {
      in: ['body'],
      isString: true,
      notEmpty: true,
      // errorMessage: 'You need to provide some content',
      trim: true
    }
  }
}
