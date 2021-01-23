const hljs = require('highlight.js')
const AppError = require('../utilities/app-error')

  const md = require('markdown-it')({
    html: true,
    linkify: true,
    highlight: function (str, lang) {
      if (lang && hljs.getLanguage(lang)) {
        try {
          return hljs.highlight(lang, str).value;
        } catch (error) {
          throw error
        }
      }
  
      return ''
    }
  })

module.exports = md
